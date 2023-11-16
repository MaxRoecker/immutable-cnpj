import type { Evaluable } from 'evaluable';
import { getSeed, hashSequence } from 'cruxhash';

/**
 * An immutable class to represent CNPJ documents.
 */
export class CNPJ implements Evaluable {
  #digits: Array<number> = [];
  #hashCode: number | null = null;

  /**
   * Creates a new immutable instance of CNPJ.
   */
  constructor(numbers: Iterable<number> = []) {
    for (const value of numbers) {
      const digit = Math.trunc(value) % 10;
      if (Number.isNaN(digit) || digit < 0 || digit > 9) continue;
      this.#digits.push(digit);
      if (this.#digits.length === 14) break;
    }
    if (this.#digits.length === 0) return CNPJ.Nil;
  }

  /**
   * The number of digits in the CNPJ.
   */
  get length(): number {
    return this.#digits.length;
  }

  /**
   * The number of digits in the CNPJ.
   * @deprecated Use `length` property instead
   */
  get size(): number {
    return this.#digits.length;
  }

  /**
   * Returns the digit located at the specified index. Negative integers count
   * back from the last digit in the current CNPJ.
   */
  at(index: number): number | undefined {
    return this.#digits.at(index);
  }

  /**
   * Returns a copy of the CNPJ with the digit at the provided index overwritten
   * with the given value. If the index is negative, then it replaces from the
   * end of the array. If the index after normalization is out of bounds,
   * a `RangeError` is thrown.
   */
  with(index: number, digit: number): CNPJ {
    const current = Math.trunc(digit) % 10;
    const previous = this.#digits.at(index);
    if (previous === current) return this;
    const digits = this.#digits.with(index, current);
    return new CNPJ(digits);
  }

  /**
   * Returns`true` if the given value is equal to this CNPJ, `false` otherwise.
   * Two CNPJs are equal if they have the same sequence of digits.
   */
  equals(other: unknown): boolean {
    return (
      this === other ||
      (other != null &&
        other instanceof CNPJ &&
        this.hashCode() === other.hashCode() &&
        this.#digits.length === other.#digits.length &&
        this.#digits.every((digit, index) => other.#digits[index] === digit))
    );
  }

  hashCode(): number {
    if (this.#hashCode == null) {
      this.#hashCode = hashSequence(this.#digits, CNPJ.#seed);
    }
    return this.#hashCode;
  }

  /**
   * Returns an object that represents the state of validity of the CNPJ.
   *
   * @see {CNPJValidityStateFlags}
   */
  getValidity(): CNPJValidityStateFlags {
    const valueMissing = this.#digits.length === 0;

    const tooShort = this.#digits.length > 0 && this.#digits.length < 14;

    const typeMismatch =
      this.#digits.length === 14 &&
      (this.#digits.every((digit) => digit === this.#digits[0]) ||
        CNPJ.getCheckDigit(this.#digits, 0, 12) !== this.#digits[12] ||
        CNPJ.getCheckDigit(this.#digits, 0, 13) !== this.#digits[13]);

    return { valueMissing, tooShort, typeMismatch };
  }

  /**
   * Check if the CNPJ is valid. A CNPJ is valid if they have 14 digits and
   * the two last digits satisfies the [validation algorithm][CNPJ].
   *
   * [CNPJ]: https://pt.wikipedia.org/wiki/Cadastro_Nacional_da_Pessoa_Jur%C3%ADdica#Pseudoc%C3%B3digo
   */
  checkValidity(): boolean {
    const { valueMissing, tooShort, typeMismatch } = this.getValidity();
    return !(valueMissing || tooShort || typeMismatch);
  }

  /**
   * Formats the CNPJ in the standard pattern "##.###.###/####-##".
   */
  format(): string {
    let output = this.#digits.slice(0, 2).join('');
    if (this.#digits.length < 2) return output;
    output = output + '.' + this.#digits.slice(2, 5).join('');
    if (this.#digits.length < 5) return output;
    output = output + '.' + this.#digits.slice(5, 8).join('');
    if (this.#digits.length < 8) return output;
    output = output + '/' + this.#digits.slice(8, 12).join('');
    if (this.#digits.length < 13) return output;
    output = output + '-' + this.#digits.slice(12, 14).join('');
    return output;
  }

  /**
   * Returns a string representation of an object.
   */
  toString(): string {
    return `[CNPJ: ${this.format()}]`;
  }

  /**
   * Serializes the CNPJ into JSON. Returns a string with all the digits of the
   * CNPJ.
   *
   * @returns an string with the digits.
   */
  toJSON(): string {
    return this.#digits.join('');
  }

  /**
   * Returns the CNPJ digits in an array.
   */
  toArray(): Array<number> {
    return Array.from(this.#digits);
  }

  /**
   * Iterates over the digits of the CNPJ.
   */
  *[Symbol.iterator](): Generator<number, void, void> {
    for (const digit of this.#digits) {
      yield digit;
    }
  }

  static #seed = getSeed('CNPJ');

  static #weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  /**
   * An empty instance of CNPJ.
   */
  static readonly Nil = new CNPJ();

  /**
   * Creates a CNPJ instance from an string. The string can be formatted or not.
   * If not enough digits are found on the string, an incomplete CNPJ will be
   * returned.
   */
  static from(formatted: string): CNPJ {
    const stripped = formatted.normalize('NFD').replace(/\D/g, '');
    if (stripped.length === 0) return CNPJ.Nil;
    const chars = stripped.substring(0, 14);
    const digits = Array.from(chars, (c) => Number.parseInt(c, 10) % 10);
    return new CNPJ(digits);
  }

  /**
   * Creates new valid CNPJ instance of random numbers.
   */
  static create(): CNPJ {
    const length = 12;
    const digits = Array.from({ length }, () => Math.trunc(Math.random() * 10));
    digits.push(CNPJ.getCheckDigit(digits));
    digits.push(CNPJ.getCheckDigit(digits));
    return new CNPJ(digits);
  }

  /**
   * Returns the CNPJ check digit from the given digits.
   */
  static getCheckDigit(
    digits: Readonly<Array<number>>,
    start = 0,
    end = digits.length,
  ): number {
    const weights = CNPJ.#weights.slice(-1 * end);
    let acc = 0;
    for (let index = start; index < end; index = index + 1) {
      acc = acc + digits[index] * weights[index];
    }
    const rem = acc % 11;
    return rem < 2 ? 0 : 11 - rem;
  }
}

/**
 * Represents the state of validity of the CNPJ.
 */
export type CNPJValidityStateFlags = {
  /**
   * Flagged as `true` if the count of CNPJ digits is zero.
   */
  valueMissing: boolean;

  /**
   * Flagged as `true` if the count of CNPJ digits between, inclusively, one and
   * fourteen.
   */
  tooShort: boolean;

  /**
   * Flagged as `true` if the number of digits is eleven but the
   * [check digit algorithm][CNPJ] fails.
   *
   * [CNPJ]: https://pt.wikipedia.org/wiki/Cadastro_Nacional_da_Pessoa_Jur%C3%ADdica#Pseudoc%C3%B3digo
   */
  typeMismatch: boolean;
};
