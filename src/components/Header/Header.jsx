import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import conf from '../../config/config.json';

class Header extends Component {
  constructor() {
    super();
    this.user = conf.user || window.location.hostname.split('.', 1)[0];
    this.state = {
      searchWord:'',
      searchAttribute:'name'
    };
  }

  render() {
    const searchDropDown = this.searchOptions();
    const attributeDropDown = this.attributeSelector();
    return (
      <header className="row align-items-center">
        <div className="col-lg-2 col-md-3 d-none d-md-block logo"></div>
        <div className="col-lg-1 col-md-3 col-sm-4">
          <select className=" form-control attributeSelector" id="attributeSelector" ref="attributeSelector" defaultValue={this.state.searchAttribute}
            onClick={ e =>{
              this.setState({searchAttribute:e.target.value});
            }}
          >{attributeDropDown}</select>
        </div>
        <div className="col-lg-2 col-md-3 col-sm-4">
          <input className="form-control" type="text" id="Rechercher" placeholder="Rechercher"
            value={this.state.searchWord}
            onChange={e => {
              this.setState({ searchWord: e.target.value })
            }}
            onKeyPress={ e => {
              if (e.key === 'Enter') {
                console.log('send searchWord:'+this.state.searchWord);
                e.target.blur()
              }
            }}
          />
          <ul>{searchDropDown}</ul>
        </div>
        <h1 className="text-center col-lg-7 col-md-6 col-sm-8"><Link to="/">{this.user}</Link></h1>
      </header>
    );
  }

  attributeSelector(){
    let options = [];
    if (this.props.attributes) {
      for (const attribute of this.props.attributes) {
          options.push( <option key={attribute}>{attribute}</option>);
      }
    }
    return options;
  }
  searchOptions() {
    let options = [];
    for (const key in this.props.selectedItems) {
      if (this.props.selectedItems.hasOwnProperty(key) && this.state.searchWord.length>0) {
        const item = this.props.selectedItems[key];
        if (item.hasOwnProperty(this.state.searchAttribute)) {
          this._filterItem(options,item,key);
        }
      }
    }
    return options;
  }

  _getSearchWord = () => {
    return this.state.searchWord;
  }

  _filterItem= (options,item,key)=>{
    console.log(item);
    const uri = `/item/${item.corpus}/${item.id}`;
    let attributeType = item[this.state.searchAttribute].constructor;
    switch (attributeType) {
      case String:
        let s = new String(item[this.state.searchAttribute]);
        if (s.includes(this.state.searchWord)) {
          options.push(<li className="searchOption" id="link" key={key}><Link  to={uri}>{item.name+":("+item[this.state.searchAttribute]+")"}</Link></li>)
        }
        break;
      case Array:
        this._recursiveFilterArray(options,uri,item,key);
        // item[this.state.searchAttribute].forEach(attributeValue => {
        //   if (attributeValue.includes(this.state.searchWord)) {
        //     options.push(<li className="searchOption" id="link" key={key}><Link  to={uri}>{item.name+":("+attributeValue+")"}</Link></li>)
        //   }
        // });
        break;
      case Object:
          console.log(item[this.state.searchAttribute] + "is Object");
          break;
      default:
        break;
    }
  }

  _recursiveFilterArray(options,uri,item,key){
    item[this.state.searchAttribute].forEach(attributeValue => {
      if (attributeValue.includes(this.state.searchWord)) {
        options.push(<li className="searchOption" id="link" key={key}><Link  to={uri}>{item.name+":("+attributeValue+")"}</Link></li>)
      }
    });
  }
}

export default Header;
