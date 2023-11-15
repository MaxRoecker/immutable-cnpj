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
   *
   * @param digits The digits of the CNPJ
   */
  constructor(digits: Iterable<number> = []) {
    const numbers = Array.from(digits).slice(0, 14);
    if (numbers.length === 0) return CNPJ.Nil;
    this.#digits = numbers.map((n) => Math.trunc(n) % 10);
  }

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
   * @returns a string representation of an object.
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
   *
   * @returns a new array witht the digits.
   */
  toArray(): Array<number> {
    return Array.from(this.#digits);
  }

  /**
   * Returns an object that represents the state of validity of the CPF, with
   * the following properties:
   * - `valueMissing`: true if the count of CPF digits is zero;
   * - `tooShort`: true if the count of CPF digits between, inclusively, one
   *   and thirteen;
   * - `typeMismatch`: true if the number of digits is fourteen but the
   *   checkdigit algorithm fails.
   *
   * @returns the validity state of the CNPJ.
   */
  getValidity(): {
    valueMissing: boolean;
    typeMismatch: boolean;
    tooShort: boolean;
  } {
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
   * Check if the CNPJ is valid. A CNPJ is valid if they have 11 digits and
   * the two last digits satisfies the [validation algorithm][CNPJ].
   *
   * [CNPJ]: https://pt.wikipedia.org/wiki/Cadastro_Nacional_da_Pessoa_Jur%C3%ADdica#Pseudoc%C3%B3digo
   *
   * @returns `true` if the CNPJ is valid, `false` otherwise.
   */
  checkValidity(): boolean {
    const { valueMissing, tooShort, typeMismatch } = this.getValidity();
    return !(valueMissing || tooShort || typeMismatch);
  }

  /**
   * Formats the CNPJ in the standard pattern "##.###.###/####-##".
   *
   * @returns a formatted string.
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
   * The number of digits in the CPF.
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
   * Iterates over the digits of the CNPJ.
   */
  *[Symbol.iterator](): Generator<number, void, void> {
    for (const digit of this.#digits) {
      yield digit;
    }
  }

  /**
   * A seed for the hashing algorithm
   */
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
   *
   * @returns a CNPJ instance.
   */
  static from(formatted: string): CNPJ {
    const stripped = formatted.replace(/\D/g, '').normalize('NFD');
    const chars = Array.from(stripped);
    if (chars.length === 0) return CNPJ.Nil;
    const digits = chars.map((d) => Number.parseInt(d, 10));
    return new CNPJ(digits);
  }

  /**
   * Creates new valid CNPJ instance of random numbers.
   *
   * @returns a CNPJ instance.
   */
  static create(): CNPJ {
    const length = 12;
    const digits = Array.from({ length }, () => Math.round(Math.random() * 9));
    digits.push(CNPJ.getCheckDigit(digits));
    digits.push(CNPJ.getCheckDigit(digits));
    return new CNPJ(digits);
  }

  /**
   * Returns the CNPJ check digit from the given digits.
   *
   * @returns the check digit.
   */
  static getCheckDigit(
    digits: Readonly<Array<number>>,
    start = 0,
    end = digits.length,
  ): number {
    const weights = CNPJ.#weights.slice(-1 * end);
    let acc = 0;
    let i = start;
    while (i < end) {
      acc = acc + digits[i] * weights[i];
      i = i + 1;
    }
    const rem = acc % 11;
    return rem < 2 ? 0 : 11 - rem;
  }
}
