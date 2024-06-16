import { createHelia } from 'helia';
import { createOrbitDB } from '@orbitdb/core';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { identify } from '@libp2p/identify';
import { createLibp2p } from 'libp2p';

const Libp2pOptions = {
  services: {
    pubsub: gossipsub({
      allowPublishToZeroPeers: true,
    }),
    identify: identify(),
  },
};

export const initOrbitDB = async () => {
  const libp2p = await createLibp2p(Libp2pOptions);
  const ipfs = await createHelia({ libp2p });
  const orbitdb = await createOrbitDB({ ipfs });

  return { orbitdb, ipfs };
};
