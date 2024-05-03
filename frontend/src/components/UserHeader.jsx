/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
function UserHeader({ user, email }) {
  return (
    <div className="text-lg font-bold">
      {user.role === "admin" ? (
        <p className="text-white hidden md:block">Micro-Focus Admin</p>
      ) : (
        <p className="text-white">{email}</p>
      )}
    </div>
  );
}

export default UserHeader;
