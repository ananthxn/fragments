const { writeFragment, readFragment, writeFragmentData, readFragmentData } = require('../../src/model/data/memory/index');

describe('Fragment Memory Database Operations', () => {
  const ownerId = 'user1';
  const fragmentId = 'fragment1';
  const fragment = { ownerId, id: fragmentId, data: 'Fragment test' };
  const buffer = Buffer.from('test Data');

  test(' Write a fragments metadata to memory db.', async () => {
    const result = await writeFragment(fragment);
    expect(result).toBe(undefined);
  });

  test('Read a fragment\'s metadata from memory db.', async () => {
    await writeFragment(fragment);
    const storedFragment = await readFragment(ownerId, fragmentId);
    expect(storedFragment).toEqual(fragment);
  });

  test(' Write a fragment\'s data buffer to memory db', async () => {
    const result = await writeFragmentData(ownerId, fragmentId, buffer);
    expect(result).toBe(undefined);
  });

  test(' Read a fragment\'s data from memory db.', async () => {
    await writeFragmentData(ownerId, fragmentId, buffer);
    const storedBuffer = await readFragmentData(ownerId, fragmentId);
    expect(storedBuffer).toEqual(buffer);
  });

});
