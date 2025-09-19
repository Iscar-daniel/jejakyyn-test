import { test, expect, defineConfig } from '@playwright/test';
import playwrightConfig from '../playwright.config';

test ('(negative) test login', async ({playwright}) => {
  
const requestContext =  await playwright.request.newContext({
  baseURL: 'https://reqres.in/',
  extraHTTPHeaders: {
    'Content-Type' : 'application/json',
    'x-api-key': 'reqres-free-v1',
  },
});

  const req = await requestContext.post('api/login', {
    data: {email : "eve.holt@refffqres.sds" , password:"test"},
  });
  console.log(req.status());
  console.log(req.url());
  expect (req.ok()).toBeFalsy();
  
  const responseBody = await req.json();
  console.log(responseBody);

  await requestContext.dispose();
})

test ('(positive) test login and create user, get user list, update and then delete it', async ({playwright}) => {
  
  // login to get token
const loginContext =  await playwright.request.newContext({
  baseURL: 'https://reqres.in/',
  extraHTTPHeaders: {
    'Content-Type' : 'application/json',
    'x-api-key': 'reqres-free-v1',
  },
});

  const req = await loginContext.post('api/login', {
    data: {email : "eve.holt@reqres.in" , password:"cityslicka"},
  });
  console.log(req.status());
  console.log(req.url());
  expect (req.ok).toBeTruthy();
  
  const responseBody = await req.json();
  console.log(responseBody);

  const token = responseBody.token;
  await loginContext.dispose();

// create new context to add users. we are using token on it
const addUserContext =  await playwright.request.newContext({
  baseURL: 'https://reqres.in/',
  extraHTTPHeaders: {
    'Content-Type' : 'application/json',
    'x-api-key': 'reqres-free-v1',
    'Authorization': 'Bearer '+token, 
  },
});

const addUserReq  = await addUserContext.post('api/users', {
  data: {email: "John Doe", job: "tukang goreng"}
});

 expect (addUserReq.ok).toBeTruthy();

await addUserContext.dispose();
 
// get User
const getUserContext = await playwright.request.newContext({
  baseURL: 'https://reqres.in/',
  extraHTTPHeaders: {
     'Content-Type' : 'application/json',
  }
});
  const getUserReq = await getUserContext.get('api/users');
  expect (getUserReq.ok).toBeTruthy();

  const userListBody = await getUserReq.json();
  const user = userListBody.data[0];



  //update User
  const updateUserContext = await playwright.request.newContext({
  baseURL: 'https://reqres.in/',
  extraHTTPHeaders: {
     'Content-Type' : 'application/json',
    'x-api-key': 'reqres-free-v1',
  }
});
  const updateUserReq = await getUserContext.put('api/users/'+user.id, {
    data: {email: "John Doe", job: "tukang pukul"}
  });
  expect (updateUserReq.ok).toBeTruthy();
  
  await updateUserContext.dispose();

  // delete user
  const deleteUserContext = await playwright.request.newContext({
  baseURL: 'https://reqres.in/',
  extraHTTPHeaders: {
    'x-api-key': 'reqres-free-v1',
  }
});
  const deleteUserReq = await getUserContext.delete('api/users/'+user.id);
  expect (deleteUserReq.ok).toBeTruthy();

  await deleteUserContext.dispose();
    await getUserContext.dispose();
})

test ('(positive) test create user', async ({playwright}) => {
  
const requestContext =  await playwright.request.newContext({
  baseURL: 'https://reqres.in/',
  extraHTTPHeaders: {
    'Content-Type' : 'application/json',
    'x-api-key': 'reqres-free-v1',
  },
});

  const req = await requestContext.post('api/login', {
    data: {email : "eve.holt@reqres.in" , password:"cityslicka"},
  });
  console.log(req.status());
  console.log(req.url());
  expect (req.ok()).toBeTruthy();
  
  const responseBody = await req.json();
  console.log(responseBody);

  await requestContext.dispose();
})