// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import path from 'path';
import fs from 'fs';
import temp from 'temp';
import { expect } from 'chai';

import { readJson, writeJson } from '../lib/filesystem-service.js';

describe('filesystem-service', () => {
  describe('readJson', () => {
    it('should read json file generated by license-report', async () => {
      const testDataFile = path.resolve('test', './test-data/license-report.json');
      const result = await readJson(testDataFile);

      expect(result).to.be.an('array');
      expect(result.length).to.equal(13, `number of entries must be 13, but has ${result.length}`);
      const numberOfProperties = Object.getOwnPropertyNames(result[1]).length;
      expect(numberOfProperties).to.equal(10, `entry 1 must have 10 properties, but has ${Object.getOwnPropertyNames(result[1]).length}`);
    });
  });

  describe('writeJson', () => {
    it('should write json file to temp directory', async () => {
      const testData = { data1: 'one', data2: 'two' };
      const targetFileName = temp.path({suffix: '.json'});
      await writeJson(testData, targetFileName);

      const targetExists = fs.existsSync(targetFileName);
      expect(targetExists, 'no file generated').to.be.true;   
    });

    it('should throw without target filename', async () => {
      const testData = { data1: 'one', data2: 'two' };
      // await expect(writeJson(testData)).to.be.rejectedWith(Error);

      try {
        await expect(writeJson(testData));
      } catch (error) {
        expect(error).to.be.instanceof(Error);
        expect(error.message).to.equal('Argument is required');
      }
    });
  });
});
