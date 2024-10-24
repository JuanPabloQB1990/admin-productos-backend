import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ 
    tableName: "products" 
})

class Product extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string

    @Column({
        type: DataType.FLOAT
    })
    declare price: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    declare availability: boolean
}

export default Product