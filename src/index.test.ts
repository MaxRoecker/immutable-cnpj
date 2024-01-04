import { expect, describe, it } from 'bun:test';
import { is } from 'evaluable';
import { CNPJ } from './index';

const digits = {
  empty: [],
  semi: [1, 1, 4, 4, 4],
  invalid: [1, 1, 4, 4, 4, 7, 7, 7, 0, 0, 0, 1, 7, 2],
  valid: [1, 1, 4, 4, 4, 7, 7, 7, 0, 0, 0, 1, 6, 1],
};

const cnpjs = {
  empty: new CNPJ(digits.empty),
  semi: new CNPJ(digits.semi),
  invalid: new CNPJ(digits.invalid),
  valid: new CNPJ(digits.valid),
};

describe('constructor tests', () => {
  it('should only use the integer part as digits', () => {
    const cnpjA = new CNPJ([1.5, 1, 4, 4, 4.1, 7, 7, 7, 0.5, 0, 0, 1, 6.9, 1]);
    const cnpjB = new CNPJ([1, 1, 4.5, 4, 4, 7.1, 7, 7, 0, 0.5, 0, 1.9, 6, 1]);
    expect(cnpjA.equals(cnpjB));
  });
  it('should only use the unit part as digits', () => {
    const cnpjA = new CNPJ([11.5, 1, 94, 4, 14.1, 7, 7, 7, 0, 0, 10, 1, 6, 1]);
    const cnpjB = new CNPJ([1, 51, 4, 4, 4, 87, 7, 7, 100, 10, 0, 11.9, 6, 1]);
    expect(cnpjA.equals(cnpjB));
  });
  it('should only use the first eleven digits', () => {
    const cnpjA = new CNPJ([1, 1, 4, 4, 4, 7, 7, 7, 0, 0, 0, 1, 6, 1, 0, 1, 2]);
    const cnpjB = new CNPJ([1, 1, 4, 4, 4, 7, 7, 7, 0, 0, 0, 1, 6, 1, 3]);
    expect(cnpjA.equals(cnpjB)).toBeTrue();
  });
  it('returns nil instance for all empty CNPJs', () => {
    const cnpjA = new CNPJ([]);
    const cnpjB = new CNPJ();
    expect(cnpjA).toBe(CNPJ.Nil);
    expect(cnpjB).toBe(CNPJ.Nil);
  });
});

describe('"CNPJ.prototype.equals" tests', () => {
  it('should return true when comparing itself', () => {
    expect(cnpjs.empty.equals(cnpjs.empty)).toBeTrue();
    expect(cnpjs.semi.equals(cnpjs.semi)).toBeTrue();
    expect(cnpjs.invalid.equals(cnpjs.invalid)).toBeTrue();
    expect(cnpjs.valid.equals(cnpjs.valid)).toBeTrue();
  });

  it('should return empty digits equal to CNPJ.Nil', () => {
    expect(cnpjs.empty.equals(CNPJ.Nil)).toBeTrue();
    expect(CNPJ.Nil.equals(cnpjs.empty)).toBeTrue();
  });

  it('should return true when having the same digits', () => {
    expect(cnpjs.empty.equals(new CNPJ(digits.empty))).toBeTrue();
    expect(cnpjs.semi.equals(new CNPJ(digits.semi))).toBeTrue();
    expect(cnpjs.invalid.equals(new CNPJ(digits.invalid))).toBeTrue();
    expect(cnpjs.valid.equals(new CNPJ(digits.valid))).toBeTrue();
  });

  it('should return false when not having the same digits', () => {
    expect(cnpjs.empty.equals(cnpjs.semi)).toBeFalse();
    expect(cnpjs.empty.equals(cnpjs.invalid)).toBeFalse();
    expect(cnpjs.empty.equals(cnpjs.valid)).toBeFalse();

    expect(cnpjs.semi.equals(cnpjs.empty)).toBeFalse();
    expect(cnpjs.semi.equals(cnpjs.invalid)).toBeFalse();
    expect(cnpjs.semi.equals(cnpjs.valid)).toBeFalse();

    expect(cnpjs.invalid.equals(cnpjs.empty)).toBeFalse();
    expect(cnpjs.invalid.equals(cnpjs.semi)).toBeFalse();
    expect(cnpjs.invalid.equals(cnpjs.valid)).toBeFalse();

    expect(cnpjs.valid.equals(cnpjs.empty)).toBeFalse();
    expect(cnpjs.valid.equals(cnpjs.semi)).toBeFalse();
    expect(cnpjs.valid.equals(cnpjs.invalid)).toBeFalse();
  });

  it('should be called when used in "is" function', () => {
    expect(is(cnpjs.empty, cnpjs.empty)).toBeTrue();
    expect(is(cnpjs.semi, cnpjs.semi)).toBeTrue();
    expect(is(cnpjs.invalid, cnpjs.invalid)).toBeTrue();
    expect(is(cnpjs.valid, cnpjs.valid)).toBeTrue();

    expect(is(cnpjs.empty, CNPJ.Nil)).toBeTrue();
    expect(is(CNPJ.Nil, cnpjs.empty)).toBeTrue();

    expect(is(cnpjs.empty, new CNPJ(digits.empty))).toBeTrue();
    expect(is(cnpjs.semi, new CNPJ(digits.semi))).toBeTrue();
    expect(is(cnpjs.invalid, new CNPJ(digits.invalid))).toBeTrue();
    expect(is(cnpjs.valid, new CNPJ(digits.valid))).toBeTrue();

    expect(is(cnpjs.empty, cnpjs.semi)).toBeFalse();
    expect(is(cnpjs.empty, cnpjs.invalid)).toBeFalse();
    expect(is(cnpjs.empty, cnpjs.valid)).toBeFalse();

    expect(is(cnpjs.semi, cnpjs.empty)).toBeFalse();
    expect(is(cnpjs.semi, cnpjs.invalid)).toBeFalse();
    expect(is(cnpjs.semi, cnpjs.valid)).toBeFalse();

    expect(is(cnpjs.invalid, cnpjs.empty)).toBeFalse();
    expect(is(cnpjs.invalid, cnpjs.semi)).toBeFalse();
    expect(is(cnpjs.invalid, cnpjs.valid)).toBeFalse();

    expect(is(cnpjs.valid, cnpjs.empty)).toBeFalse();
    expect(is(cnpjs.valid, cnpjs.semi)).toBeFalse();
    expect(is(cnpjs.valid, cnpjs.invalid)).toBeFalse();
  });
});

describe('"CNPJ.prototype.hashCode" tests', () => {
  it('should return the same hash for same digits.', () => {
    expect(cnpjs.empty.hashCode()).toBe(new CNPJ(digits.empty).hashCode());
    expect(cnpjs.semi.hashCode()).toBe(new CNPJ(digits.semi).hashCode());
    expect(cnpjs.invalid.hashCode()).toBe(new CNPJ(digits.invalid).hashCode());
    expect(cnpjs.valid.hashCode()).toBe(new CNPJ(digits.valid).hashCode());
  });
});

describe('"CNPJ.prototype.at" tests', () => {
  it('should return the digit in the given index.', () => {
    expect(cnpjs.semi.at(0)).toBe(1);
    expect(cnpjs.semi.at(-1)).toBe(4);
    expect(cnpjs.invalid.at(1)).toBe(1);
    expect(cnpjs.invalid.at(-2)).toBe(7);
    expect(cnpjs.valid.at(3)).toBe(4);
    expect(cnpjs.valid.at(-3)).toBe(1);
  });
  it('should return undefined in the given index.', () => {
    expect(cnpjs.empty.at(0)).toBeUndefined();
    expect(cnpjs.empty.at(-1)).toBeUndefined();
    expect(cnpjs.semi.at(5)).toBeUndefined();
    expect(cnpjs.semi.at(-6)).toBeUndefined();
    expect(cnpjs.invalid.at(14)).toBeUndefined();
    expect(cnpjs.invalid.at(-15)).toBeUndefined();
    expect(cnpjs.valid.at(20)).toBeUndefined();
    expect(cnpjs.valid.at(-100)).toBeUndefined();
  });
});

describe('"CNPJ.prototype.with" tests', () => {
  it('should return a new CNPJ with the value in the given index.', () => {
    const cnpjA = new CNPJ([1, 1, 4, 4, 4, 7, 7, 7, 0, 0, 0, 1, 6, 0]);
    expect(cnpjA.with(13, 1).equals(cnpjs.valid)).toBeTrue();
    expect(cnpjA.with(-1, 1).equals(cnpjs.valid)).toBeTrue();
  });
  it('should return the same CNPJ if no change is made.', () => {
    expect(cnpjs.valid.with(13, 1)).toBe(cnpjs.valid);
    expect(cnpjs.valid.with(-1, 1.5)).toBe(cnpjs.valid);
  });
  it('should throw an `RangeError` on out-of-bounds index.', () => {
    expect(() => cnpjs.empty.with(0, 1)).toThrow(RangeError);
    expect(() => cnpjs.valid.with(14, 0)).toThrow(RangeError);
    expect(() => cnpjs.valid.with(-15, 1)).toThrow(RangeError);
  });
});

describe('"CNPJ.prototype.toString" tests', () => {
  it('should return an string representation.', () => {
    expect(cnpjs.empty.toString()).toBe('[CNPJ: ]');
    expect(cnpjs.semi.toString()).toBe('[CNPJ: 11.444.]');
    expect(cnpjs.invalid.toString()).toBe('[CNPJ: 11.444.777/0001-72]');
    expect(cnpjs.valid.toString()).toBe('[CNPJ: 11.444.777/0001-61]');
  });
});

describe('"CNPJ.prototype.toJSON" tests', () => {
  it('should return an JSON representation.', () => {
    expect(cnpjs.empty.toJSON()).toBe('');
    expect(cnpjs.semi.toJSON()).toBe('11444');
    expect(cnpjs.invalid.toJSON()).toBe('11444777000172');
    expect(cnpjs.valid.toJSON()).toBe('11444777000161');
  });
  it('should override the JSON.stringify behavior.', () => {
    expect(JSON.stringify(cnpjs.empty)).toBe('""');
    expect(JSON.stringify(cnpjs.semi)).toBe('"11444"');
    expect(JSON.stringify(cnpjs.invalid)).toBe('"11444777000172"');
    expect(JSON.stringify(cnpjs.valid)).toBe('"11444777000161"');
  });
});

describe('"CNPJ.prototype.toArray" tests', () => {
  it('should return an array with digits.', () => {
    expect(cnpjs.empty.toArray()).toEqual(digits.empty);
    expect(cnpjs.semi.toArray()).toEqual(digits.semi);
    expect(cnpjs.invalid.toArray()).toEqual(digits.invalid);
    expect(cnpjs.valid.toArray()).toEqual(digits.valid);
  });
});

describe('"CNPJ.prototype.getValidity" tests', () => {
  const validities = {
    empty: cnpjs.empty.getValidity(),
    semi: cnpjs.semi.getValidity(),
    invalid: cnpjs.invalid.getValidity(),
    valid: cnpjs.valid.getValidity(),
  };

  it('should return true valueMissing for empty CNPJs.', () => {
    expect(validities.empty.valueMissing).toBeTrue();
    expect(validities.semi.valueMissing).toBeFalse();
    expect(validities.invalid.valueMissing).toBeFalse();
    expect(validities.valid.valueMissing).toBeFalse();
  });
  it('should return true tooShort for CNPJs with digits between zero and fourteen.', () => {
    expect(validities.empty.tooShort).toBeFalse();
    expect(validities.semi.tooShort).toBeTrue();
    expect(validities.invalid.tooShort).toBeFalse();
    expect(validities.valid.tooShort).toBeFalse();
  });
  it('should return true typeMismatch for CNPJs with fourteen digits but invalid check digits.', () => {
    expect(validities.empty.typeMismatch).toBeFalse();
    expect(validities.semi.typeMismatch).toBeFalse();
    expect(validities.invalid.typeMismatch).toBeTrue();
    expect(validities.valid.typeMismatch).toBeFalse();
  });
});

describe('"CNPJ.prototype.checkValidity" tests', () => {
  it('should return false for CNPJs with invalid digits.', () => {
    expect(cnpjs.empty.checkValidity()).toBeFalse();
    expect(cnpjs.semi.checkValidity()).toBeFalse();
    expect(cnpjs.invalid.checkValidity()).toBeFalse();
  });
  it('should return false for CNPJs with same digits.', () => {
    for (let index = 0; index < 10; index++) {
      const digits = new Array(11).fill(index);
      expect(new CNPJ(digits).checkValidity()).toBeFalse();
    }
  });
  it('should return true for CNPJs with valid digits.', () => {
    expect(cnpjs.valid.checkValidity()).toBeTrue();
  });
});

describe('"CNPJ.prototype.format" tests', () => {
  it('should return an formatted string.', () => {
    expect(cnpjs.empty.format()).toBe('');
    expect(cnpjs.semi.format()).toBe('11.444.');
    expect(cnpjs.invalid.format()).toBe('11.444.777/0001-72');
    expect(cnpjs.valid.format()).toBe('11.444.777/0001-61');
  });
});

describe('"CNPJ.prototype.length" tests', () => {
  it('should return the number of digits in the CNPJ.', () => {
    expect(cnpjs.empty.length).toBe(0);
    expect(cnpjs.semi.length).toBe(5);
    expect(cnpjs.invalid.length).toBe(14);
    expect(cnpjs.valid.length).toBe(14);
  });
});

describe('"CNPJ.prototype.size" tests', () => {
  it('should return the number of digits in the CNPJ.', () => {
    expect(cnpjs.empty.size).toBe(0);
    expect(cnpjs.semi.size).toBe(5);
    expect(cnpjs.invalid.size).toBe(14);
    expect(cnpjs.valid.size).toBe(14);
  });
});

describe('"CNPJ.prototype[Symbol.iterator]" tests', () => {
  it('should return an interator with the digits in the CNPJ.', () => {
    const tests: (keyof typeof cnpjs)[] = ['empty', 'invalid', 'semi', 'valid'];
    for (const test of tests) {
      let index = 0;
      for (const digit of cnpjs[test]) {
        // @ts-expect-error index is already checked.
        expect(digit).toBe(digits[test][index]);
        index += 1;
      }
    }
  });
});

describe('"CNPJ.Nil" tests', () => {
  it('should be equals to a nil instance.', () => {
    expect(CNPJ.Nil.equals(CNPJ.Nil)).toBeTrue();
    expect(CNPJ.Nil.equals(cnpjs.empty)).toBeTrue();
  });
  it('should have an empty string representation.', () => {
    expect(CNPJ.Nil.toString()).toBe('[CNPJ: ]');
  });
  it('should have an empty JSON representation.', () => {
    expect(CNPJ.Nil.toJSON()).toBe('');
  });
  it('should have an empty array representation.', () => {
    expect(CNPJ.Nil.toArray()).toEqual([]);
  });
  it('should not be valid.', () => {
    expect(CNPJ.Nil.checkValidity()).toBeFalse();
  });
  it('should have an empty formatted string representation.', () => {
    expect(CNPJ.Nil.format()).toBe('');
  });
});

describe('"CNPJ.from" tests', () => {
  it('should return a nil instance with empty strings.', () => {
    expect(CNPJ.from('').equals(CNPJ.Nil)).toBeTrue();
  });
  it('should return nil instance with strings with no decimal numbers.', () => {
    expect(CNPJ.from('aaa').equals(CNPJ.Nil)).toBeTrue();
    expect(CNPJ.from('a long string').equals(CNPJ.Nil)).toBeTrue();
    expect(CNPJ.from('\u2014').equals(CNPJ.Nil)).toBeTrue();
  });
  it('should return incomplete instance with strings with some decimal numbers.', () => {
    expect(CNPJ.from('11444').equals(cnpjs.semi)).toBeTrue();
    expect(CNPJ.from('1, 1, 4, 4, 4').equals(cnpjs.semi)).toBeTrue();
    expect(CNPJ.from('11 ab44\u2014 4').equals(cnpjs.semi)).toBeTrue();
  });
  it('should return invalid instance with strings with at least 11 decimal numbers.', () => {
    expect(CNPJ.from('11444777000172').equals(cnpjs.invalid)).toBeTrue();
    expect(CNPJ.from('11444777000172001').equals(cnpjs.invalid)).toBeTrue();
    expect(CNPJ.from('11.444.777/0001-72').equals(cnpjs.invalid)).toBeTrue();
    expect(CNPJ.from('11 444 777—000172').equals(cnpjs.invalid)).toBeTrue();
    expect(CNPJ.from('11 444 777—000172001').equals(cnpjs.invalid)).toBeTrue();
  });
  it('should return valid instance with strings with at least 11 decimal numbers.', () => {
    expect(CNPJ.from('11444777000161').equals(cnpjs.valid)).toBeTrue();
    expect(CNPJ.from('11444777000161001').equals(cnpjs.valid)).toBeTrue();
    expect(CNPJ.from('11.444.777/0001-61').equals(cnpjs.valid)).toBeTrue();
    expect(CNPJ.from('11 444 777—000161').equals(cnpjs.valid)).toBeTrue();
    expect(CNPJ.from('11 444 777—000161001').equals(cnpjs.valid)).toBeTrue();
  });
});

describe('"CNPJ.create" tests', () => {
  it('should create valid CNPJs', () => {
    for (let index = 0; index < 100; index++) {
      const cnpj = CNPJ.create();
      expect(cnpj.checkValidity()).toBeTrue();
    }
  });
});
