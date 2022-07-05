import React from 'react'
import userAPI from '@api/user/methods/meteor';
import validator from 'validator';
import Meteor, {Accounts} from "react-native-meteor";
import {AsyncStorage} from 'react-native';

function MethodMixin(Component) {
  return class Method extends Component {
    constructor(props) {
      super(props);
      this.state = {
      }
    }

    componentDidMount() {
      console.log("Channel screen mounted")
    };
    // helpers
    closeControlPanel = () => {
      this._drawer.close()
    };
    openControlPanel = () => {
      this._drawer.open()
    };
  }
}

export default MethodMixin;
