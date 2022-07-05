// import React from 'react'
// import userAPI from '@api/user/methods/meteor';
// import validator from 'validator';
// import Meteor, {Accounts} from "react-native-meteor";
// import {AsyncStorage} from 'react-native';
// import Orientation from 'react-native-orientation-locker';
//
// function MethodMixin(Component) {
//   return class Method extends Component {
//     constructor(props) {
//       super(props);
//       this.state = {
//         country: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         isLoading: false
//       }
//     }
//
//     componentDidMount() {
//       // Orientation.lockToPortrait();
//     };
//     // Event handlers
//     _onPressLogin = () => {
//       this.props.history.push('/');
//     };
//     _onPressSignUp = () => {
//       const {country, email, password, confirmPassword} = this.state;
//       // Validate fields
//       if (validator.isEmpty(country)) {
//         alert("Country is required.");
//         return
//       } else if (validator.isEmpty(email)) {
//         alert("Email is required.");
//         return
//       } else if (validator.isEmpty(password)) {
//         alert("Password is required.");
//         return
//       } else if (validator.isEmpty(confirmPassword)) {
//         alert("Confirm password is required.");
//         return
//       } else if (!validator.isEmail(email)) {
//         alert("Email is not valid.");
//         return
//       } else if (!validator.equals(password, confirmPassword)) {
//         alert("Password and confirm password should match.");
//         return
//       }
//       this._register(country, email, password);
//     };
//     // Helpers
//     _toggleLoading = (bool) => {
//       this.setState({isLoading: bool})
//     };
//     // API
//     _register = (country, email, password) => {
//       this._toggleLoading(true);
//       Accounts.createUser({ email, password, profile: {country} }, (error, result) => {
//         this._toggleLoading(false);
//         if (error) {
//           const {reason} = error;
//           if (reason) {
//             alert(reason);
//           }
//         } else {
//           this._signIn();
//         }
//       });
//     };
//     _signIn() {
//       const { email, password } = this.state;
//       Meteor.loginWithPassword(email, password, (error) => {
//         if (error) {
//           const {reason} = error;
//           if (reason) {
//             alert(reason);
//           }
//         } else {
//           this.props.history.push('/home');
//         }
//       });
//     }
//   }
// }
//
// export default MethodMixin;
