import React, { PureComponent } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'auto-bind';
import PropTypes from 'prop-types';
import styles from './styles.scss';

class DynamicFontBox extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
    this.fontBox = React.createRef();
  }

  checkOverflow() {
    const el = this.fontBox.current;
    return Math.floor(el.scrollHeight) > Math.ceil(el.getBoundingClientRect().height);
  }

  componentDidMount() {
    while (this.checkOverflow()) {
      const el = this.fontBox.current;
      for (let node of el.children) {
        if (!node) {
          break;
        }
        const fontSize = parseInt(window.getComputedStyle(node).fontSize);
        if (!fontSize) {
          break;
        }
        node.style.fontSize = `${fontSize - 1}px`;
      }
    }
  }

  render() {
    const { children, className } = this.props;
    return (
      <div className={cx(styles.dynamicFontBox, className)} ref={this.fontBox} >{children}</div >
    );
  }
}

DynamicFontBox.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string
};

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(DynamicFontBox);
