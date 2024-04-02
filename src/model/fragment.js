// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');


class Fragment {
  constructor({ id = randomUUID(), ownerId, created = new Date().toISOString(), updated = new Date().toISOString(), type, size = 0 }) {
    if (!ownerId || !type) {
      throw new Error('ownerId is required');
    }
    if (!type) {
      throw new Error('type is required');
    }
    if (typeof size !== 'number' || size < 0) {
      throw new Error('size must be a non-negative number');
    }
    if (!Fragment.isSupportedType(type)) {
      throw new Error(`Unsupported type: ${type}`);
    }

    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {

    const fragments = await listFragments(ownerId, expand);
    return expand ? fragments.map(fragment => new Fragment(fragment)) : fragments;
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fragment = await readFragment(ownerId, id);
    if (!fragment) {
      throw new Error(`Fragment not found for id: ${id}`);
    }
    return new Fragment(fragment);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  // static delete(ownerId, id) {
  //   return deleteFragment(ownerId, id);
  // }
  static async delete(ownerId, id) {
    return await deleteFragment(ownerId, id);
  }

  /**
  * Saves the current fragment to the database
  * @returns Promise<void>
  */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {

    if (!Buffer.isBuffer(data)) {
      throw new Error('Data must be a Buffer');
    }
    await writeFragmentData(this.ownerId, this.id, data);
    this.size = data.length;
    await this.save();
  }

  /**
  * Returns the mime type (e.g., without encoding) for the fragment's type:
  * "text/html; charset=utf-8" -> "text/html"
  * @returns {string} fragment's mime type (without encoding)
  */
  get mimeType() {
    return contentType.parse(this.type).type;
  }

  /**
  * Returns true if this fragment is a text/* mime type
  * @returns {boolean} true if fragment's type is text/*
  */
  get isText() {
    return this.mimeType.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return [this.mimeType];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    let validType = [
      'text/plain',
      'text/plain; charset=utf-8',
      'text/markdown',
      'text/html',
      'application/json'
    ];

    return validType.includes(value);
  }
}

module.exports = { Fragment };


