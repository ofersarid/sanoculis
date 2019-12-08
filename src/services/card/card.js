import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './styles.scss';

class Card extends PureComponent {
  render() {
    const { logo, firstLine, secondLine, thirdLine } = this.props;
    return ReactDOM.createPortal(
      <div className={styles.bizCard} >
        <div className={styles.contentBox} >
          <div className={styles.logo} >
            <img src={logo} />
            <h2 >Sanoculis</h2 >
          </div >
          <ul className={styles.info} >
            <li >{firstLine}</li >
            <li >{secondLine}</li >
            <li >{thirdLine}</li >
          </ul >
        </div >
      </div >,
      document.body);
  }
}

Card.propTypes = {
  logo: PropTypes.string.isRequired,
  underLogo: PropTypes.string,
  firstLine: PropTypes.string.isRequired,
  secondLine: PropTypes.string.isRequired,
  thirdLine: PropTypes.string.isRequired
};

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default connect(mapStateToProps, mapDispatchToProps)(Card);
