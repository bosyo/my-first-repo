import React from 'react'
import userAPI from '@api/user/methods/meteor';
import validator from 'validator';
import Meteor, {Accounts} from "react-native-meteor";
import {AsyncStorage} from 'react-native';
import Orientation from "react-native-orientation-locker";

function MethodMixin(Component) {
  return class Method extends Component {
    constructor(props) {
      super(props);
      this.state = {
        tabs: [
          {name: 'PHARCYDE TV'},
          {name: 'PHTV 24'},
          {name: 'SYS TV'},
          {name: 'CYDELIFE RADIO'},
          {name: 'ITS ON'},
          {name: 'FLICKSS'},
        ],
        activeTabInfo: null
      }
    }

    componentDidMount() {
      // Orientation.lockToLandscape();
    };

    // Event handlers
    _onPressTab = (tab) => {
      this._setActiveTabInfo(tab);
    };
    _onPressLogo = () => {
      this.props.history.push('/home')
    };
    _onPressNav = (route) => {
      route === 'channels'
        ? this._setActiveTabInfo(null)
        : this.props.history.push(route)
    };
    // helpers
    _setActiveTabInfo = (activeTabInfo) => {
      this.setState({activeTabInfo})
    };
    closeControlPanel = () => {
      this._drawer.close()
    };
    openControlPanel = () => {
      this._drawer.open()
    };

  }
}

export default MethodMixin;
