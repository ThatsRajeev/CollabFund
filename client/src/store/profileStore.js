import { initOrbitDB } from './orbitdb';

class ProfileStore {
  constructor() {
    this.orbitdb = null;
    this.db = null;
  }

  async init() {
    const { orbitdb, ipfs } = await initOrbitDB();
    this.orbitdb = orbitdb;

    // Create or open a key-value database
    this.db = await this.orbitdb.open('user_profiles', { type: 'keyvalue', create: true });
  }

  async setProfile(address, profile) {
    await this.db.put(address, profile);
  }

  async getProfile(address) {
    return await this.db.get(address);
  }

  async getAllProfiles() {
    return await this.db.all();
  }
}

const profileStore = new ProfileStore();
export default profileStore;
