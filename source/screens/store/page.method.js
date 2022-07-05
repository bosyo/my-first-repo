import React from 'react'
import userAPI from '@api/user/methods/meteor';
import validator from 'validator';
import Meteor, {Accounts} from "react-native-meteor";
import {AsyncStorage} from 'react-native';
import Orientation from 'react-native-orientation-locker';

function MethodMixin(Component) {
  return class Method extends Component {
    constructor(props) {
      super(props);
      this.state = {
      }
    }

    componentDidMount() {
      // Orientation.lockToLandscape();
    };
    // Event handlers
    _onPressWomen = () => {
      this._navigateToItemsScreen()
    };
    _onPressMen = () => {
      this._navigateToItemsScreen()
    };
    _onPressAllItems = () => {
      this._navigateToItemsScreen()
    };
    _onPressLogo = () => {
      this.props.history.push('/home')
    };
    _onPressNav = (route) => {
      this.props.history.push(route)
    };
    // helpers
    onLayout = (e) => {
      this.setState({
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height,
      })
    }
    _navigateToItemsScreen = () => {
      this.props.history.push('/items')
    }
    closeControlPanel = () => {
      this._drawer.close()
    };
    openControlPanel = () => {
      this._drawer.open()
    };
  }
}

export default MethodMixin;
