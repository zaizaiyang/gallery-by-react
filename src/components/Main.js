require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';


// 获取图片的相关信息
let imageDatas = require('../data/imageDatas.json');
let imageUrl = require('../images/yeoman.png');
// 利用立即执行函数，将图片信息转成图片URL路径信息
imageDatas=(function genImageURL(imageDatasArr){
	for(var i=0; i<imageDatasArr.length; i++){
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas)


// 单个图片组件
class ImgFigure extends React.Component {
	render(){
		return(
			<figure className="img-figure">
				<img className="imgs" src={this.props.data.imageURL} alt={this.props.data.title} />
				<figcation>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcation>
			</figure>
		);
	}
};

class AppComponent extends React.Component {
  render() {
  	var controllerUnits = [],
  			ImgFigures = [];
		imageDatas.forEach(function(value){
			ImgFigures.push(<ImgFigure data={value} />);
		});
  	
    return (
      <div className="stage">
      	<div className="img-sec">
      		{ImgFigures}
      	</div>
      	<div className="controller-nav">
      		controllerUnits
      	</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
