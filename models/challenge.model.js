var mongoose = require('../dbconnection');

var Schema = mongoose.Schema;

var blockSchema = new Schema({
    block_id: { type: Number, required: true, unique: true},
    start_time: { type: Number, required: true},//Minutes SINCE 00:00
    end_time: { type: Number, required: true},
});

blockSchema
    .virtual('duration_h')
    .get(function(){
        return (this.end_time - this.start_time)/60;
    })

    blockSchema
    .virtual('duration_m')
    .get(function(){
        return (this.end_time - this.start_time);
    })

    blockSchema
    .virtual('start')
    .get(function(){
        return this.start_time/60;
    })

    blockSchema
    .virtual('end')
    .get(function(){
        return this.end_time/60;
    })

var Block = mongoose.model('blocks', blockSchema);
module.exports = Block;
