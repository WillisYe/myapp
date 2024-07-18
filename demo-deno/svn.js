// deno run -A svn.js
import Client from 'npm:svn-spawn'

console.log(Client)

var client = new Client({
  cwd: 'svn://192.168.30.222/Code/Trunk/front/st.front.tmc',
  username: 'dary', // optional if authentication not required or is already saved
  password: 'meiya2023', // optional if authentication not required or is already saved
  noAuthCache: true, // optional, if true, username does not become the logged in user on the machine
});

console.log(client)
console.log(Object.keys(client))

client.update(function(err, data) {
  console.log('updated');
});

// client.getInfo(function(err, data) {
//   console.log('Repository url is %s', data.url);
// });