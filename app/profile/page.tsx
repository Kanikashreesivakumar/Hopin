export async function signOut() {
  // Mock implementation of signOut function
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("User signed out");
      resolve(true);
    }, 1000);
  });
}
