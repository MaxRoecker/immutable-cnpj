import { expect } from '@esm-bundle/chai';
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
});

describe('"CNPJ.prototype.equals" tests', () => {
  it('should return true when comparing itself', () => {
    expect(cnpjs.empty.equals(cnpjs.empty)).equal(true);
    expect(cnpjs.semi.equals(cnpjs.semi)).equal(true);
    expect(cnpjs.invalid.equals(cnpjs.invalid)).equal(true);
    expect(cnpjs.valid.equals(cnpjs.valid)).equal(true);
  });

  it('should return empty digits equal to CNPJ.Nil', () => {
    expect(cnpjs.empty.equals(CNPJ.Nil)).equal(true);
    expect(CNPJ.Nil.equals(cnpjs.empty)).equal(true);
  });

  it('should return true when having the same digits', () => {
    expect(cnpjs.empty.equals(new CNPJ(digits.empty))).equal(true);
    expect(cnpjs.semi.equals(new CNPJ(digits.semi))).equal(true);
    expect(cnpjs.invalid.equals(new CNPJ(digits.invalid))).equal(true);
    expect(cnpjs.valid.equals(new CNPJ(digits.valid))).equal(true);
  });

  it('should return false when not having the same digits', () => {
    expect(cnpjs.empty.equals(cnpjs.semi)).equal(false);
    expect(cnpjs.empty.equals(cnpjs.invalid)).equal(false);
    expect(cnpjs.empty.equals(cnpjs.valid)).equal(false);

    expect(cnpjs.semi.equals(cnpjs.empty)).equal(false);
    expect(cnpjs.semi.equals(cnpjs.invalid)).equal(false);
    expect(cnpjs.semi.equals(cnpjs.valid)).equal(false);

    expect(cnpjs.invalid.equals(cnpjs.empty)).equal(false);
    expect(cnpjs.invalid.equals(cnpjs.semi)).equal(false);
    expect(cnpjs.invalid.equals(cnpjs.valid)).equal(false);

    expect(cnpjs.valid.equals(cnpjs.empty)).equal(false);
    expect(cnpjs.valid.equals(cnpjs.semi)).equal(false);
    expect(cnpjs.valid.equals(cnpjs.invalid)).equal(false);
  });

  it('should be called when used in "is" function', () => {
    expect(is(cnpjs.empty, cnpjs.empty)).equal(true);
    expect(is(cnpjs.semi, cnpjs.semi)).equal(true);
    expect(is(cnpjs.invalid, cnpjs.invalid)).equal(true);
    expect(is(cnpjs.valid, cnpjs.valid)).equal(true);

    expect(is(cnpjs.empty, CNPJ.Nil)).equal(true);
    expect(is(CNPJ.Nil, cnpjs.empty)).equal(true);

    expect(is(cnpjs.empty, new CNPJ(digits.empty))).equal(true);
    expect(is(cnpjs.semi, new CNPJ(digits.semi))).equal(true);
    expect(is(cnpjs.invalid, new CNPJ(digits.invalid))).equal(true);
    expect(is(cnpjs.valid, new CNPJ(digits.valid))).equal(true);

    expect(is(cnpjs.empty, cnpjs.semi)).equal(false);
    expect(is(cnpjs.empty, cnpjs.invalid)).equal(false);
    expect(is(cnpjs.empty, cnpjs.valid)).equal(false);

    expect(is(cnpjs.semi, cnpjs.empty)).equal(false);
    expect(is(cnpjs.semi, cnpjs.invalid)).equal(false);
    expect(is(cnpjs.semi, cnpjs.valid)).equal(false);

    expect(is(cnpjs.invalid, cnpjs.empty)).equal(false);
    expect(is(cnpjs.invalid, cnpjs.semi)).equal(false);
    expect(is(cnpjs.invalid, cnpjs.valid)).equal(false);

    expect(is(cnpjs.valid, cnpjs.empty)).equal(false);
    expect(is(cnpjs.valid, cnpjs.semi)).equal(false);
    expect(is(cnpjs.valid, cnpjs.invalid)).equal(false);
  });
});

describe('"CNPJ.prototype.hashCode" tests', () => {
  it('should return the same hash for same digits.', () => {
    expect(cnpjs.empty.hashCode()).equal(new CNPJ(digits.empty).hashCode());
    expect(cnpjs.semi.hashCode()).equal(new CNPJ(digits.semi).hashCode());
    expect(cnpjs.invalid.hashCode()).equal(new CNPJ(digits.invalid).hashCode());
    expect(cnpjs.valid.hashCode()).equal(new CNPJ(digits.valid).hashCode());
  });
});

describe('"CNPJ.prototype.toString" tests', () => {
  it('should return an string representation.', () => {
    expect(cnpjs.empty.toString()).equal('[CNPJ: ]');
    expect(cnpjs.semi.toString()).equal('[CNPJ: 11.444.]');
    expect(cnpjs.invalid.toString()).equal('[CNPJ: 11.444.777/0001-72]');
    expect(cnpjs.valid.toString()).equal('[CNPJ: 11.444.777/0001-61]');
  });
});

describe('"CNPJ.prototype.toJSON" tests', () => {
  it('should return an JSON representation.', () => {
    expect(cnpjs.empty.toJSON()).equal('');
    expect(cnpjs.semi.toJSON()).equal('11444');
    expect(cnpjs.invalid.toJSON()).equal('11444777000172');
    expect(cnpjs.valid.toJSON()).equal('11444777000161');
  });
  it('should override the JSON.stringify behavior.', () => {
    expect(JSON.stringify(cnpjs.empty)).equal('""');
    expect(JSON.stringify(cnpjs.semi)).equal('"11444"');
    expect(JSON.stringify(cnpjs.invalid)).equal('"11444777000172"');
    expect(JSON.stringify(cnpjs.valid)).equal('"11444777000161"');
  });
});

describe('"CNPJ.prototype.toArray" tests', () => {
  it('should return an array with digits.', () => {
    expect(cnpjs.empty.toArray()).deep.equal(digits.empty);
    expect(cnpjs.semi.toArray()).deep.equal(digits.semi);
    expect(cnpjs.invalid.toArray()).deep.equal(digits.invalid);
    expect(cnpjs.valid.toArray()).deep.equal(digits.valid);
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
    expect(validities.empty.valueMissing).equal(true);
    expect(validities.semi.valueMissing).equal(false);
    expect(validities.invalid.valueMissing).equal(false);
    expect(validities.valid.valueMissing).equal(false);
  });
  it('should return true tooShort for CNPJs with digits between zero and fourteen.', () => {
    expect(validities.empty.tooShort).equal(false);
    expect(validities.semi.tooShort).equal(true);
    expect(validities.invalid.tooShort).equal(false);
    expect(validities.valid.tooShort).equal(false);
  });
  it('should return true typeMismatch for CNPJs with fourteen digits but invalid check digits.', () => {
    expect(validities.empty.typeMismatch).equal(false);
    expect(validities.semi.typeMismatch).equal(false);
    expect(validities.invalid.typeMismatch).equal(true);
    expect(validities.valid.typeMismatch).equal(false);
  });
});

describe('"CNPJ.prototype.checkValidity" tests', () => {
  it('should return false for CNPJs with invalid digits.', () => {
    expect(cnpjs.empty.checkValidity()).equal(false);
    expect(cnpjs.semi.checkValidity()).equal(false);
    expect(cnpjs.invalid.checkValidity()).equal(false);
  });
  it('should return false for CNPJs with same digits.', () => {
    for (let index = 0; index < 10; index++) {
      const digits = new Array(11).fill(index);
      expect(new CNPJ(digits).checkValidity()).equal(false);
    }
  });
  it('should return true for CNPJs with valid digits.', () => {
    expect(cnpjs.valid.checkValidity()).equal(true);
  });
});

describe('"CNPJ.prototype.format" tests', () => {
  it('should return an formatted string.', () => {
    expect(cnpjs.empty.format()).equal('');
    expect(cnpjs.semi.format()).equal('11.444.');
    expect(cnpjs.invalid.format()).equal('11.444.777/0001-72');
    expect(cnpjs.valid.format()).equal('11.444.777/0001-61');
  });
});

describe('"CNPJ.prototype.size" tests', () => {
  it('should return the number of digits in the CNPJ.', () => {
    expect(cnpjs.empty.size).equal(0);
    expect(cnpjs.semi.size).equal(5);
    expect(cnpjs.invalid.size).equal(14);
    expect(cnpjs.valid.size).equal(14);
  });
});

describe('"CNPJ.prototype[Symbol.iterator]" tests', () => {
  it('should return an interator with the digits in the CNPJ.', () => {
    const tests: (keyof typeof cnpjs)[] = ['empty', 'invalid', 'semi', 'valid'];
    for (const test of tests) {
      let index = 0;
      for (const digit of cnpjs[test]) {
        expect(digit).equal(digits[test][index]);
        index += 1;
      }
    }
  });
});

describe('"CNPJ.Nil" tests', () => {
  it('should be equals to a nil instance.', () => {
    expect(CNPJ.Nil.equals(CNPJ.Nil)).equal(true);
    expect(CNPJ.Nil.equals(cnpjs.empty)).equal(true);
  });
  it('should have hash code equals to zero.', () => {
    expect(CNPJ.Nil.hashCode()).equal(0);
  });
  it('should have an empty string representation.', () => {
    expect(CNPJ.Nil.toString()).equal('[CNPJ: ]');
  });
  it('should have an empty JSON representation.', () => {
    expect(CNPJ.Nil.toJSON()).equal('');
  });
  it('should have an empty array representation.', () => {
    expect(CNPJ.Nil.toArray()).deep.equal([]);
  });
  it('should not be valid.', () => {
    expect(CNPJ.Nil.checkValidity()).equal(false);
  });
  it('should have an empty formatted string representation.', () => {
    expect(CNPJ.Nil.format()).equal('');
  });
});

describe('"CNPJ.from" tests', () => {
  it('should return a nil instance with empty strings.', () => {
    expect(CNPJ.from('').equals(CNPJ.Nil)).equal(true);
  });
  it('should return nil instance with strings with no decimal numbers.', () => {
    expect(CNPJ.from('aaa').equals(CNPJ.Nil)).equal(true);
    expect(CNPJ.from('a long string').equals(CNPJ.Nil)).equal(true);
    expect(CNPJ.from('\u2014').equals(CNPJ.Nil)).equal(true);
  });
  it('should return incomplete instance with strings with some decimal numbers.', () => {
    expect(CNPJ.from('11444').equals(cnpjs.semi)).equal(true);
    expect(CNPJ.from('1, 1, 4, 4, 4').equals(cnpjs.semi)).equal(true);
    expect(CNPJ.from('11 ab44\u2014 4').equals(cnpjs.semi)).equal(true);
  });
  it('should return invalid instance with strings with at least 11 decimal numbers.', () => {
    expect(CNPJ.from('11444777000172').equals(cnpjs.invalid)).equal(true);
    expect(CNPJ.from('11444777000172001').equals(cnpjs.invalid)).equal(true);
    expect(CNPJ.from('11.444.777/0001-72').equals(cnpjs.invalid)).equal(true);
    expect(CNPJ.from('11 444 777—000172').equals(cnpjs.invalid)).equal(true);
    expect(CNPJ.from('11 444 777—000172001').equals(cnpjs.invalid)).equal(true);
  });
  it('should return valid instance with strings with at least 11 decimal numbers.', () => {
    expect(CNPJ.from('11444777000161').equals(cnpjs.valid)).equal(true);
    expect(CNPJ.from('11444777000161001').equals(cnpjs.valid)).equal(true);
    expect(CNPJ.from('11.444.777/0001-61').equals(cnpjs.valid)).equal(true);
    expect(CNPJ.from('11 444 777—000161').equals(cnpjs.valid)).equal(true);
    expect(CNPJ.from('11 444 777—000161001').equals(cnpjs.valid)).equal(true);
  });
});

describe('"CNPJ.create" tests', () => {
  it('should create valid CNPJs', () => {
    for (let index = 0; index < 100; index++) {
      const cnpj = CNPJ.create();
      expect(cnpj.checkValidity()).equal(true);
    }
  });
});
