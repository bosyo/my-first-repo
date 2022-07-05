import React from 'react'
import userAPI from '@api/user/methods/meteor';
import validator from 'validator';
import Meteor, {Accounts} from "react-native-meteor";
import {AsyncStorage} from 'react-native';
import {images} from '@styles';
import Orientation from 'react-native-orientation-locker';

function MethodMixin(Component) {
  return class Method extends Component {
    constructor(props) {
      super(props);
      this.state = {
        tabs: [
          {name: 'SHIRT'},
          {name: 'LONG SLEEVE'},
          {name: 'READY - TO - WEAR'},
          {name: 'HATS'},
          {name: 'ACCESSORIES'},
          {name: 'SHOES'},
        ],
        sampleItems: [
          {
            image: images.shirtPlaceholder,
            name: 'Sample shirt description1',
            price: 10,
            designImages: [images.shirtPlaceholder, images.shirtPlaceholder, images.shirtPlaceholder]
          },
          {
            image: images.shirtPlaceholder,
            name: 'Sample shirt description1',
            price: 12,
            designImages: [images.shirtPlaceholder, images.shirtPlaceholder, images.shirtPlaceholder]
          },
          {
            image: images.shirtPlaceholder,
            name: 'Sample shirt description1',
            price: 17,
            designImages: [images.shirtPlaceholder, images.shirtPlaceholder, images.shirtPlaceholder]
          },
          {
            image: images.shirtPlaceholder,
            name: 'Sample shirt description1',
            price: 20,
            designImages: [images.shirtPlaceholder, images.shirtPlaceholder, images.shirtPlaceholder]
          },
          {
            image: images.shirtPlaceholder,
            name: 'Sample shirt description1',
            price: 18,
            designImages: [images.shirtPlaceholder, images.shirtPlaceholder, images.shirtPlaceholder]
          },
        ],
        productModal: false,
        activeProduct: null,
        selected: 'small'
      }
    }

    componentDidMount() {
      console.log("Channel screen mounted")
    };

    // Event handlers
    _onPressProduct = (product) => {
      // Orientation.lockToPortrait();
      this._setActiveProduct(product);
      this._toggleProductModal(true);
    };
    _onSelectSize = (size) => {
      this._setSize(size)
    };
    // Helpers
    _toggleProductModal = (bool) => {
      this.setState({productModal: bool})
    };
    _setActiveProduct = (productInfo) => {
      this.setState({activeProduct: productInfo})
    };
    _setSize = (selected) => {
      this.setState({selected})
    }
  }
}

export default MethodMixin;
