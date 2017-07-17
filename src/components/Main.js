require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';


// 获取图片的相关信息
let imageDatas = require('../data/imageDatas.json');

// 利用立即执行函数，将图片信息转成图片URL路径信息
imageDatas=(function genImageURL(imageDatasArr){
	for(var i=0; i<imageDatasArr.length; i++){
		var singleImageData = imageDatasArr[i];
		singleImageData.imgURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas)

class AppComponent extends React.Component {
  render() {
    return (
      <div className="stage">
      	<div className="img-sec">
      	</div>
      	<div className="controller-nav">
      	</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
