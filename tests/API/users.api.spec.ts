import { test, expect } from '@playwright/test';

test.use({ baseURL: 'https://reqres.in' });

// The tests share the created user's id, so they must run in order.
test.describe.configure({ mode: 'serial' });

/*
 * Observed behaviour of the live ReqRes API (verified before writing these tests):
 *  - POST /api/users          -> 201, echoes name/job and returns id + createdAt
 *  - GET  /api/users/{newId}  -> 404 {}   (created users are NOT persisted; read-only demo API)
 *  - PUT  /api/users/{newId}  -> 200, echoes the new name + updatedAt
 * Because of this, the GET step documents the real 404 for the created id and
 * validates the "get user details" contract against a seeded user instead.
 */
test.describe('ReqRes users API', () => {
    const newUser = { name: 'Test User', job: 'QA Engineer' };
    let userId: string;

    test('Given a new user, when it is created, then the API returns 201 and an id', async ({ request }) => {
        const response = await request.post('/api/users', { data: newUser });

        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(body.name).toBe(newUser.name);
        expect(body.job).toBe(newUser.job);
        expect(body.id).toBeTruthy();
        expect(body.createdAt).toBeTruthy();

        userId = String(body.id);
    });

    test('When the created user is requested, then the API reports it as not persisted (404)', async ({ request }) => {
        expect(userId, 'userId must be set by the create test').toBeTruthy();

        const response = await request.get(`/api/users/${userId}`);

        expect(response.status()).toBe(404);
    });

    test('When a seeded user is requested, then the API returns its details', async ({ request }) => {
        const response = await request.get('/api/users/2');

        expect(response.status()).toBe(200);

        const { data } = await response.json();
        expect(data.id).toBe(2);
        expect(data.email).toBe('janet.weaver@reqres.in');
        expect(data.first_name).toBe('Janet');
        expect(data.last_name).toBe('Weaver');
    });

    test('When the created user name is updated, then the response contains the new name', async ({ request }) => {
        expect(userId, 'userId must be set by the create test').toBeTruthy();

        const updatedName = 'Updated User';
        const response = await request.put(`/api/users/${userId}`, {
            data: { name: updatedName, job: newUser.job },
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.name).toBe(updatedName);
        expect(body.job).toBe(newUser.job);
        expect(body.updatedAt).toBeTruthy();
    });
});
