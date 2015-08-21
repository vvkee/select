/**
 * [select组建]
 * @param  container       (string)      [传入一个选择器，建议以id为选择器，例如:'#test']
 * @param  width           (number)      [选择框宽度]
 * @param  height          (number)      [选择框高度]
 * @param  font_size       (number)      [选择框里字体大小]
 * @param  onSelectChange  (function)    [选择后回调函数]
 * @param  onSelectClick   (function)    [点击选择框时回调函数]
 * @param  options         (array)       [选项，以数组形式]
 * @param  options = [{text: 'example', value: 'example_value'}]                                        
 * 
 */
var tpl = __inline('tpl/select.tmpl');
function SelectBox(_option){
    var html,
        option = {
        container: _option.container || '',
        width: _option.width || 160,
        height: _option.height || 30,
        font_size: _option.font_size || 14,
        onSelectChange: _option.onSelectChange || '',
        onSelectClick: _option.onSelectClick || '',
        options: _option.options || [],
        options_max_height: _option.options_max_height || 200
    };
    if(!$){
        console.log('依赖jquery！请引入jquery1.7+');
        return
    }
    if(!option.container) return
    
    this.select = {};
    this.select.style = {};

    // select容器样式
    this.select.style.width = option.width;
    this.select.style.height = option.height;
    this.select.style.font_size = option.font_size;
    this.select.style.options_max_height = option.options_max_height;

    // select容器
    this.select.select_container = $(option.container);

    html = tpl({
        options: option.options
    }); 
    this.select.select_container.html(html);

    // 获取选中容器
    this.select.selected_container = this.select.select_container.find(".select-box .selected");
    this.select.selected_option = this.select.selected_container.find('.selected-text');
    this.select.arrow = this.select.selected_container.find('.select-box-icon-drop');
    this.select.options_container = this.select.select_container.find(".select-box .select-option");

     // 设置样式
    this.setSelectFontSize();
    this.setSelectWidth();
    this.setSelectHeight();
    this.setOptionsHeight();

    // 绑定事件
    bindBoxClick(this, option.onSelectClick);
    bindBoxLeave(this);
    bindSelect(this, option.onSelectChange);
}

/**
 * [设置字体大小]
 */
SelectBox.prototype.setSelectFontSize = function(_font_size){
    var font_size = _font_size || this.select.style.font_size;
    this.select.select_container.css('font-size', font_size);
}
/**
 * [设置宽度]
 */
SelectBox.prototype.setSelectWidth = function(_width){
    var width = _width || this.select.style.width
    this.select.select_container.css('width', width);
}
/**
 * [设置高度]
 */
SelectBox.prototype.setSelectHeight = function(_height){
    var height = _height || this.select.style.height;
    this.select.select_container.css({
        'line-height': height + 'px',
        'height': height + 'px'
    });
}

/**
 * [设置option容器最高高度]
 */
SelectBox.prototype.setOptionsHeight = function(_height){
    var height = _height || this.select.style.options_max_height;
    this.select.options_container.css({
        'max-height': height + 'px'
    });
}

/**
 * [显示选择框]
 * @return {[type]} [description]
 */
SelectBox.prototype.show = function(){
    var arrow = this.select.arrow;

    arrow.addClass('up').removeClass('down');

    this.select.options_container.show(100);
}

/**
 * [隐藏选择框]
 * @return {[type]} [description]
 */
SelectBox.prototype.hide = function(){
    var arrow = this.select.arrow;

    arrow.addClass('down').removeClass('up');

    this.select.options_container.hide(100);
}

/**
 * [设置选项]
 * @param  options         (array)       [选项，以数组形式]
 * @param  options = [{text: 'example', value: 'example_value'}] 
 */
SelectBox.prototype.setOptions = function(options){
    if(typeof options !== 'object') return
    var options_container = this.select.options_container,
        html = '<li class="active" data-value="" title="请选择"><a href="javaScript:">请选择</a></li>',
        length = options.length;

    for (var i = 0; i < length; i++) {
        var obj = options[i];
        if(obj.text){
            var text = obj.text;
        } else {
            var text = '';
        }
        if(obj.value){
            var value = obj.value;
        } else {
            var value = '';
        }
        html += '<li data-value="' + value + '" title="' + text +'"><a href="javaScript:">' + text + '</a></li>';
    };
    options_container.html(html);
}

/**
 * [添加选项]
 * @param  options         (array)       [选项，以数组形式]
 * @param  options = [{text: 'example', value: 'example_value'}] 
 */
SelectBox.prototype.appendOptions = function(options){
    if(typeof options !== 'object') return
    var options_container = this.select.options_container,
        html = '',
        length = options.length;
    for (var i = 0; i < length; i++) {
        var obj = options[i];
        if(obj.text){
            var text = obj.text;
        } else {
            var text = '';
        }
        if(obj.value){
            var value = obj.value;
        } else {
            var value = '';
        }
        html += '<li data-value="' + value + '" title="' + text +'"><a href="javaScript:">' + text + '</a></li>';
    };
    options_container.append(html);
}

/**
 * [获取选中的值]
 * @return [返回字符串]
 */
SelectBox.prototype.val = function(){
    return this.select.selected_option.attr('data-value');
}

/**
 * [获取选中的文字]
 * @return [返回字符串]
 */
SelectBox.prototype.text = function(){
    return this.select.selected_option.text();
}

/**
 * [点击select框]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var bindBoxClick = function(that, callback){
    that.select.selected_container.on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        var arrow = that.select.arrow;
        if(arrow.hasClass('down')){
            that.show();
        } else if(arrow.hasClass('up')){
            that.hide();
        }
        
        if(typeof callback === 'function'){
            callback(that);
        }
    });
}

/**
 * [离开box时隐藏select框]
 * @param  {[type]}   that     [description]
 * @return {[type]}            [description]
 */
var bindBoxLeave = function(that){
    that.select.select_container.on('mouseleave', function(event) {
        that.hide();
    });
}

/**
 * [选择]
 * @param  {[type]}   that     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var bindSelect = function(that, callback){
    that.select.options_container.on('click', 'li', function(event) {
        /* Act on the event */
        var obj = $(this);
        var selected_value = obj.attr('data-value');
        var selected_text = obj.attr('title');

        that.select.selected_option.attr('data-value', selected_value);
        that.select.selected_option.attr('title', selected_text);
        that.select.selected_option.text(selected_text);

        // 清空原有的active，加上选中的active
        var options = that.select.options_container.find('li');
        options.each(function(index, el) {
            var option = $(this);
            var option_value = option.attr('data-value'); 

            option.removeClass('active');
            if(selected_value == option_value){
                option.addClass('active');
            }
        });

        that.hide();

        if(typeof callback === 'function'){
            callback(selected_value, selected_text);
        }
    });
}

module.exports = SelectBox;