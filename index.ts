import type { Evaluable } from 'evaluable';
import { hashIterable } from 'cruxhash';

/**
 * An immutable class to represent CNPJ documents.
 */
export class CNPJ implements Evaluable {
  private readonly digits: number[];
  private readonly hash: number;

  /**
   * Creates a new immutable instance of CNPJ.
   *
   * @param digits The digits of the CNPJ
   */
  constructor(digits: Iterable<number>) {
    const numbers = Array.from(digits).slice(0, 14);
    this.digits = numbers.map((n) => Math.trunc(n) % 10);
    this.hash = hashIterable(this.digits);
  }

  equals(other: unknown): boolean {
    return (
      this === other ||
      (other != null &&
        other instanceof CNPJ &&
        this.hash === other.hash &&
        this.digits.length === other.digits.length &&
        this.digits.every((digit, index) => other.digits[index] === digit))
    );
  }

  hashCode(): number {
    return this.hash;
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
    return this.digits.join('');
  }

  /**
   * Returns the CNPJ digits in an array.
   *
   * @returns a new array witht the digits.
   */
  toArray(): number[] {
    return Array.from(this.digits);
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
    if (this.digits.length !== 14) return false;
    if (this.digits.every((digit) => digit === this.digits[0])) return false;
    if (CNPJ.digit(this.digits.slice(0, 12)) !== this.digits[12]) return false;
    if (CNPJ.digit(this.digits.slice(0, 13)) !== this.digits[13]) return false;
    return true;
  }

  /**
   * Formats the CNPJ in the standard pattern "##.###.###/####-##".
   *
   * @returns a formatted string.
   */
  format(): string {
    let output = this.digits.slice(0, 2).join('');
    if (this.digits.length < 2) return output;
    output = output + '.' + this.digits.slice(2, 5).join('');
    if (this.digits.length < 5) return output;
    output = output + '.' + this.digits.slice(5, 8).join('');
    if (this.digits.length < 8) return output;
    output = output + '/' + this.digits.slice(8, 12).join('');
    if (this.digits.length < 13) return output;
    output = output + '-' + this.digits.slice(12, 14).join('');
    return output;
  }

  /**
   * An empty instance of CNPJ.
   */
  static readonly Nil = new CNPJ([]);

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
    const digits = Array.from({ length: 12 }, () => {
      return Math.round(Math.random() * 9);
    });
    digits.push(CNPJ.digit(digits));
    digits.push(CNPJ.digit(digits));
    return new CNPJ(digits);
  }

  private static readonly weights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  /**
   * Returns the CNPJ check digit from the given digits.
   *
   * @returns the check digit.
   */
  private static digit(digits: number[]): number {
    const weights = CNPJ.weights.slice(-1 * digits.length);
    let acc = 0;
    let i = 0;
    while (i < digits.length) {
      acc = acc + digits[i] * weights[i];
      i = i + 1;
    }
    const rem = acc % 11;
    return rem < 2 ? 0 : 11 - rem;
  }
}
