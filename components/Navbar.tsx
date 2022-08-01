import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {
  const { user, username }: any = { user: "", username: '' }

  return (<nav className="navbar">
    <ul>
      <li>
        <Link href="/">
          <button className="btn-logo">FEED</button>
        </Link>
      </li>

      {/* user is signed-in and has username */}
      {username && (
        <>
          <li className="push-left">
            <Link href="/admin">
              <button className="btn-blue">Write Posts</button>
            </Link>
          </li>
          <li>
            <Link href={`/${username}`}>
              <Image alt='User Profile Image' src={user?.photoURL} />
            </Link>
          </li>
        </>
      )}

      {/* user is not signed OR has not created username */}
      {!username && (
        <li>
          <Link href="/enter">
            <button className="btn-blue">Log in</button>
          </Link>
        </li>
      )}
    </ul>
  </nav>)
}
