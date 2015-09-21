import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import withViewport from '../../../decorators/withViewport';
import api from '../../../core/ApiClient';
import apiUrls from '../../../constants/ApiUrls.js';
import styles from './Suggest.scss';
import withStyles from '../../../decorators/withStyles';

import Overlay from '../../ui/Overlay';
import SuggestModel from './SuggestModel';

@withViewport
@withStyles(styles) class Suggest extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            placeholder: props.data.placeholder,
            value: null,
            options: null,
            showSuggest: false,
            optionCounter: 0,
            onBlurDisabled: false
        };
    }

    handleFocus(event) {
        this.setState({
            showSuggest: true
        });
    }

    handleBlur(event) {
        if(this.state.onBlurDisabled){
            this.setState({
                showSuggest: true
            });
        }else{
            this.setState({
                showSuggest: false
            });
        }
    }

    handleOptionHover(event){
        if(event.type == "mouseenter"){
            this.setState({
                onBlurDisabled: true
            });
        }
        if(event.type == "mouseleave"){
            this.setState({
                onBlurDisabled: false
            });
        }
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
        if (event.target.value) {
            SuggestModel.getSuggest(event.target.value)
                .then((data)=> {
                    this.setState({
                        options: SuggestModel.focusOptionItem(data, 0),
                        showSuggest: true
                    })
                })
        } else {
            this.setState({
                showSuggest: false
            });
        }
    }

    onSetResult(data) {
        if (this.props.setResult) {
            this.props.setResult(data)
        }
    }

    handleOptionClick(item) {
        this.selectedOption(item);
    }

    onKeyDown(event) {
        let options = this.state.options;
        if (event.keyCode == 13) {
            var item = this.state.options[this.state.optionCounter];
            this.selectedOption(item);
        } else {
            let counter = SuggestModel.selectedKeyDown(this.state.optionCounter, options, event.keyCode);
            this.setState({
                options: SuggestModel.focusOptionItem(options, counter),
                optionCounter: counter
            });
        }
    }

    selectedOption(item) {
        this.onSetResult(item);
        this.setState({
            value: item.Name,
            showSuggest: false
        });
    }


    renderSuggestInput() {
        return (
            <input className={`b-suggest__input ${this.state.showSuggest ? "b-suggest__input_focus" : ""}`}
                   type="text"
                   placeholder={this.state.placeholder}
                   onFocus={this.handleFocus.bind(this)}
                   onBlur={this.handleBlur.bind(this)}
                   onChange={this.handleChange.bind(this)}
                   onKeyDown={this.onKeyDown.bind(this)}
                   value={this.state.value}
                />
        );
    }

    renderSuggestOptions() {
        return (
            <ul className="b-suggest-list"
                onMouseEnter={this.handleOptionHover.bind(this)}
                onMouseLeave={this.handleOptionHover.bind(this)}
                >
                {this.state.options.map((item, index)=> {
                    return (
                        <li className={`b-suggest-item ${item.selected ? 'b-suggest-item_selected' : ''}`}
                            key={index}
                            onClick={this.handleOptionClick.bind(this, item)}
                            >
                            <span className="b-suggest-item__city-name">{item.Name}</span>,
                            <span className="b-suggest-item__country-name">{item.CountryName}</span>
                            <span className="b-suggest-item__iata">{item.CodeIata}</span>
                        </li>
                    );
                }, this)}
            </ul>
        );
    }


    renderSuggest() {
        if (this.state.showSuggest) {
            if (this.props.viewport.width < 1100) {
                return (
                    <Overlay>
                        <div className="b-suggest__options">
                            {this.renderSuggestInput()}
                            {this.renderSuggestOptions()}
                        </div>
                    </Overlay>
                );
            } else {
                return (
                    <div className="b-suggest__options">
                        {this.renderSuggestOptions()}
                    </div>
                );
            }
        }
        return null;
    }

    render() {
        return (
            <div className="b-suggest">
                {this.renderSuggestInput()}
                {this.renderSuggest()}
            </div>
        );
    }

}

export default Suggest;
