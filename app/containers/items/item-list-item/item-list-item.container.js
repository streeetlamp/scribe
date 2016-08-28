import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import ListItem from '../../../components/list-item/list-item.component';
import { loadItem, deleteItem } from '../../../actions/items.actions';

function ItemListItemContainer(props) {
  function onClickCallback() {
    browserHistory.push(`/items/${props.data._id}`);
    return props.loadItem(props.data._id);
  }

  function deleteItemCallback() {
    props.deleteItem(props.data._id);
  }

  const active = props.itemsState.item._id === props.data._id;

  return (
    <div>
      <button onClick={deleteItemCallback}>X</button>
      <ListItem
        active={active}
        name={props.data.name}
        onClick={onClickCallback}
      />
    </div>
  );
}

ItemListItemContainer.propTypes = {
  data: PropTypes.object.isRequired,
  loadItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  itemsState: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    itemsState: state.itemsState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadItem, deleteItem }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ItemListItemContainer);
