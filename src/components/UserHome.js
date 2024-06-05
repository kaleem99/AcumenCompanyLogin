import { connect } from "react-redux";

const UserHome = ({ session }) => {
  console.log(session);
  return (
    <div className="UserHome">
      <table>
        <tr>
          <th>Username</th>
          <th>Email</th>
        </tr>

        <tr>
          <td>{session["cognito:username"]}</td>
          <td>{session.email}</td>
        </tr>
      </table>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    section: state.section,
    session: state.session.idToken.payload,
  };
};
export default connect(mapStateToProps, {})(UserHome);
