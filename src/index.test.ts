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
    const cpfA = new CNPJ([1, 1, 4, 4, 4, 7, 7, 7, 0, 0, 0, 1, 6, 1, 0, 1, 2]);
    const cpfB = new CNPJ([1, 1, 4, 4, 4, 7, 7, 7, 0, 0, 0, 1, 6, 1, 3]);
    expect(cpfA.equals(cpfB)).toBe(true);
  });
  it('returns nil instance for all empty CNPJs', () => {
    const cpfA = new CNPJ([]);
    const cpfB = new CNPJ();
    expect(cpfA).toBe(CNPJ.Nil);
    expect(cpfB).toBe(CNPJ.Nil);
  });
});

describe('"CNPJ.prototype.equals" tests', () => {
  it('should return true when comparing itself', () => {
    expect(cnpjs.empty.equals(cnpjs.empty)).toBe(true);
    expect(cnpjs.semi.equals(cnpjs.semi)).toBe(true);
    expect(cnpjs.invalid.equals(cnpjs.invalid)).toBe(true);
    expect(cnpjs.valid.equals(cnpjs.valid)).toBe(true);
  });

  it('should return empty digits equal to CNPJ.Nil', () => {
    expect(cnpjs.empty.equals(CNPJ.Nil)).toBe(true);
    expect(CNPJ.Nil.equals(cnpjs.empty)).toBe(true);
  });

  it('should return true when having the same digits', () => {
    expect(cnpjs.empty.equals(new CNPJ(digits.empty))).toBe(true);
    expect(cnpjs.semi.equals(new CNPJ(digits.semi))).toBe(true);
    expect(cnpjs.invalid.equals(new CNPJ(digits.invalid))).toBe(true);
    expect(cnpjs.valid.equals(new CNPJ(digits.valid))).toBe(true);
  });

  it('should return false when not having the same digits', () => {
    expect(cnpjs.empty.equals(cnpjs.semi)).toBe(false);
    expect(cnpjs.empty.equals(cnpjs.invalid)).toBe(false);
    expect(cnpjs.empty.equals(cnpjs.valid)).toBe(false);

    expect(cnpjs.semi.equals(cnpjs.empty)).toBe(false);
    expect(cnpjs.semi.equals(cnpjs.invalid)).toBe(false);
    expect(cnpjs.semi.equals(cnpjs.valid)).toBe(false);

    expect(cnpjs.invalid.equals(cnpjs.empty)).toBe(false);
    expect(cnpjs.invalid.equals(cnpjs.semi)).toBe(false);
    expect(cnpjs.invalid.equals(cnpjs.valid)).toBe(false);

    expect(cnpjs.valid.equals(cnpjs.empty)).toBe(false);
    expect(cnpjs.valid.equals(cnpjs.semi)).toBe(false);
    expect(cnpjs.valid.equals(cnpjs.invalid)).toBe(false);
  });

  it('should be called when used in "is" function', () => {
    expect(is(cnpjs.empty, cnpjs.empty)).toBe(true);
    expect(is(cnpjs.semi, cnpjs.semi)).toBe(true);
    expect(is(cnpjs.invalid, cnpjs.invalid)).toBe(true);
    expect(is(cnpjs.valid, cnpjs.valid)).toBe(true);

    expect(is(cnpjs.empty, CNPJ.Nil)).toBe(true);
    expect(is(CNPJ.Nil, cnpjs.empty)).toBe(true);

    expect(is(cnpjs.empty, new CNPJ(digits.empty))).toBe(true);
    expect(is(cnpjs.semi, new CNPJ(digits.semi))).toBe(true);
    expect(is(cnpjs.invalid, new CNPJ(digits.invalid))).toBe(true);
    expect(is(cnpjs.valid, new CNPJ(digits.valid))).toBe(true);

    expect(is(cnpjs.empty, cnpjs.semi)).toBe(false);
    expect(is(cnpjs.empty, cnpjs.invalid)).toBe(false);
    expect(is(cnpjs.empty, cnpjs.valid)).toBe(false);

    expect(is(cnpjs.semi, cnpjs.empty)).toBe(false);
    expect(is(cnpjs.semi, cnpjs.invalid)).toBe(false);
    expect(is(cnpjs.semi, cnpjs.valid)).toBe(false);

    expect(is(cnpjs.invalid, cnpjs.empty)).toBe(false);
    expect(is(cnpjs.invalid, cnpjs.semi)).toBe(false);
    expect(is(cnpjs.invalid, cnpjs.valid)).toBe(false);

    expect(is(cnpjs.valid, cnpjs.empty)).toBe(false);
    expect(is(cnpjs.valid, cnpjs.semi)).toBe(false);
    expect(is(cnpjs.valid, cnpjs.invalid)).toBe(false);
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
    expect(validities.empty.valueMissing).toBe(true);
    expect(validities.semi.valueMissing).toBe(false);
    expect(validities.invalid.valueMissing).toBe(false);
    expect(validities.valid.valueMissing).toBe(false);
  });
  it('should return true tooShort for CNPJs with digits between zero and fourteen.', () => {
    expect(validities.empty.tooShort).toBe(false);
    expect(validities.semi.tooShort).toBe(true);
    expect(validities.invalid.tooShort).toBe(false);
    expect(validities.valid.tooShort).toBe(false);
  });
  it('should return true typeMismatch for CNPJs with fourteen digits but invalid check digits.', () => {
    expect(validities.empty.typeMismatch).toBe(false);
    expect(validities.semi.typeMismatch).toBe(false);
    expect(validities.invalid.typeMismatch).toBe(true);
    expect(validities.valid.typeMismatch).toBe(false);
  });
});

describe('"CNPJ.prototype.checkValidity" tests', () => {
  it('should return false for CNPJs with invalid digits.', () => {
    expect(cnpjs.empty.checkValidity()).toBe(false);
    expect(cnpjs.semi.checkValidity()).toBe(false);
    expect(cnpjs.invalid.checkValidity()).toBe(false);
  });
  it('should return false for CNPJs with same digits.', () => {
    for (let index = 0; index < 10; index++) {
      const digits = new Array(11).fill(index);
      expect(new CNPJ(digits).checkValidity()).toBe(false);
    }
  });
  it('should return true for CNPJs with valid digits.', () => {
    expect(cnpjs.valid.checkValidity()).toBe(true);
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
        expect(digit).toBe(digits[test][index]);
        index += 1;
      }
    }
  });
});

describe('"CNPJ.Nil" tests', () => {
  it('should be equals to a nil instance.', () => {
    expect(CNPJ.Nil.equals(CNPJ.Nil)).toBe(true);
    expect(CNPJ.Nil.equals(cnpjs.empty)).toBe(true);
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
    expect(CNPJ.Nil.checkValidity()).toBe(false);
  });
  it('should have an empty formatted string representation.', () => {
    expect(CNPJ.Nil.format()).toBe('');
  });
});

describe('"CNPJ.from" tests', () => {
  it('should return a nil instance with empty strings.', () => {
    expect(CNPJ.from('').equals(CNPJ.Nil)).toBe(true);
  });
  it('should return nil instance with strings with no decimal numbers.', () => {
    expect(CNPJ.from('aaa').equals(CNPJ.Nil)).toBe(true);
    expect(CNPJ.from('a long string').equals(CNPJ.Nil)).toBe(true);
    expect(CNPJ.from('\u2014').equals(CNPJ.Nil)).toBe(true);
  });
  it('should return incomplete instance with strings with some decimal numbers.', () => {
    expect(CNPJ.from('11444').equals(cnpjs.semi)).toBe(true);
    expect(CNPJ.from('1, 1, 4, 4, 4').equals(cnpjs.semi)).toBe(true);
    expect(CNPJ.from('11 ab44\u2014 4').equals(cnpjs.semi)).toBe(true);
  });
  it('should return invalid instance with strings with at least 11 decimal numbers.', () => {
    expect(CNPJ.from('11444777000172').equals(cnpjs.invalid)).toBe(true);
    expect(CNPJ.from('11444777000172001').equals(cnpjs.invalid)).toBe(true);
    expect(CNPJ.from('11.444.777/0001-72').equals(cnpjs.invalid)).toBe(true);
    expect(CNPJ.from('11 444 777—000172').equals(cnpjs.invalid)).toBe(true);
    expect(CNPJ.from('11 444 777—000172001').equals(cnpjs.invalid)).toBe(true);
  });
  it('should return valid instance with strings with at least 11 decimal numbers.', () => {
    expect(CNPJ.from('11444777000161').equals(cnpjs.valid)).toBe(true);
    expect(CNPJ.from('11444777000161001').equals(cnpjs.valid)).toBe(true);
    expect(CNPJ.from('11.444.777/0001-61').equals(cnpjs.valid)).toBe(true);
    expect(CNPJ.from('11 444 777—000161').equals(cnpjs.valid)).toBe(true);
    expect(CNPJ.from('11 444 777—000161001').equals(cnpjs.valid)).toBe(true);
  });
});

describe('"CNPJ.create" tests', () => {
  it('should create valid CNPJs', () => {
    for (let index = 0; index < 100; index++) {
      const cnpj = CNPJ.create();
      expect(cnpj.checkValidity()).toBe(true);
    }
  });
});
