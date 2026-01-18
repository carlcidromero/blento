import { AtpBaseClient } from '@atproto/api';
import { client } from './auth.svelte';
import type { Record as ListRecord } from '@atproto/api/dist/client/types/com/atproto/repo/listRecords';
import type { At } from '@atcute/client/lexicons';

export async function resolveHandle({ handle }: { handle: string }) {
	const agent = new AtpBaseClient({ service: 'https://api.bsky.app' });

	const data = await agent.com.atproto.identity.resolveHandle({ handle });
	return data.data.did;
}

const didPDSCache: Record<string, string> = {};

const getPDS = async (did: string) => {
	if (did in didPDSCache) return didPDSCache[did];
	const res = await fetch(
		did.startsWith('did:web')
			? `https://${did.split(':')[2]}/.well-known/did.json`
			: 'https://plc.directory/' + did
	);

	return res.json().then((doc) => {
		if (!doc.service) throw new Error('No PDS found');
		for (const service of doc.service) {
			if (service.id === '#atproto_pds') {
				didPDSCache[did] = service.serviceEndpoint.toString();
			}
		}
		return didPDSCache[did];
	});
};

export async function getProfile({ agent, did }: { agent?: AtpBaseClient; did: string }) {
	agent ??= new AtpBaseClient({ service: 'https://api.bsky.app' });
	const { data } = await agent.app.bsky.actor.getProfile({ actor: did });
	return data;
}

export async function listRecords({
	did,
	collection,
	cursor,
	limit = 0
}: {
	did: string;
	collection: string;
	cursor?: string;
	limit?: number;
}) {
	const pds = await getPDS(did);

	const agent = new AtpBaseClient({ service: pds });

	const allRecords = [];

	let currentCursor = cursor;
	do {
		const response = await agent.com.atproto.repo.listRecords({
			repo: did,
			collection,
			limit: limit || 100,
			cursor: currentCursor
		});
		allRecords.push(...response.data.records);
		currentCursor = response.data.cursor;
	} while (currentCursor && (!limit || allRecords.length < limit));

	return allRecords;
}

export async function getRecord({
	did,
	collection,
	rkey
}: {
	did: string;
	collection: string;
	rkey: string;
}) {
	if (!did || !collection || !rkey) {
		console.error('Missing parameters for getRecord', { did, collection, rkey });
		throw new Error('Missing parameters for getRecord');
	}
	const pds = await getPDS(did);

	const agent = new AtpBaseClient({ service: pds });

	const record = await agent.com.atproto.repo.getRecord({
		repo: did,
		collection,
		rkey
	});

	return JSON.parse(JSON.stringify(record.data)) as ListRecord;
}

export async function putRecord({
	collection,
	rkey,
	record
}: {
	collection: `${string}.${string}.${string}`;
	rkey: string;
	record: Record<string, unknown>;
}) {
	if (!client.profile || !client.rpc) throw new Error('No profile or rpc');

	const response = await client.rpc.call('com.atproto.repo.putRecord', {
		data: {
			collection,
			repo: client.profile.did as At.Identifier,
			rkey,
			record: {
				...record
			}
		}
	});

	return response;
}

export async function deleteRecord({
	did,
	collection,
	rkey
}: {
	did: string;
	collection: `${string}.${string}.${string}`;
	rkey: string;
}) {
	if (!client.profile || !client.rpc) throw new Error('No profile or rpc');

	const response = await client.rpc.call('com.atproto.repo.deleteRecord', {
		data: {
			collection,
			repo: did as At.Identifier,
			rkey
		}
	});

	return response;
}

export async function getBlob({ did, cid }: { did: string; cid: string }) {
	const pds = await getPDS(did);
	return `${pds}/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${cid}`;
}

export async function uploadImage({
	image,
	did,
	rkey,
	collection,
	key
}: {
	image: Blob;
	did: string;
	collection: `${string}.${string}.${string}`;
	rkey: string;
	key: string;
}) {
	const blobResponse = await client.rpc?.request({
		type: 'post',
		nsid: 'com.atproto.repo.uploadBlob',
		params: {
			repo: did
		},
		data: image
	});

	const blobInfo = blobResponse?.data.blob as {
		$type: 'blob';
		ref: {
			$link: string;
		};
		mimeType: string;
		size: number;
	};

	await putRecord({ collection, record: { [key]: blobInfo }, rkey });

	return blobInfo;
}

export async function describeRepo({ did }: { did: string }) {
	const pds = await getPDS(did);

	const agent = new AtpBaseClient({ service: pds });

	const repo = await agent.com.atproto.repo.describeRepo({
		repo: did
	});

	return repo;
}
