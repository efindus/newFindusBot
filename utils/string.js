String.prototype.toTitleCase = function() {
    var result = this.split(' ')
    for(var i = 0; i < result.length; i++){
        if(result == '') continue
        var second = result[i].substring(1).toLowerCase()
        result[i] = result[i][0].toUpperCase() + second
    }
    result = result.join(' ')
    return result
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}