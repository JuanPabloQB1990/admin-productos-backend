import { Table, Column, Model, DataType } from "sequelize-typescript"

@Table({ 
    tableName: "products" 
})

class Product extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    name: string

    @Column({
        type: DataType.FLOAT(6,2)
    })
    price: string

    @Column({
        type: DataType.BOOLEAN
    })
    availibity: boolean
}

export default Product