import {getUser} from '@/actions/common';
import {auth} from '@/auth';

export default async function Page() {
  const user = await getUser(auth);
  console.log(user);
  return <p>TODO</p>;
}
