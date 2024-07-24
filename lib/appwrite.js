export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projectId: "66910ab0000e55ee813c",
  databaseId: "66910bca001885ded35b",
  userCollectionId: "66910bf400002d9adb2a",
  videoCollectionId: "66910c2e001f66ff7342",
  storageId: "66910d500038927ec7a5",
};

// Init your react-native SDK
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";
// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.
const account = new Account(client);//account from appwrite
const avatars = new Avatars(client);
const databases= new Databases(client)//database funtion from appwrite

export const createUser = async (email, password, username) => {
  try {
    // create Account
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);


    await signIn(email,password);
    
    
    const newUser= await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId:newAccount.$id,
        email,
        username,
        avatar:avatarUrl
      }
    )
    return newUser
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async(email, password)=> {
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
}


export const getCurrentUser=async()=>{
  try {
    const currentAccount= await account.get();
    if(!currentAccount) throw Error

    const currentUser=await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId',currentAccount.$id)]
    )

    if(!currentUser) throw Error;
    return currentUser.documents[0]
  } catch (error) {
    console.log(error)
  }
}

// Register User
