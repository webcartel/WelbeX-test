<template>
    <div>
        <div v-if="bodyRows.length" class="table">
            
            <div class="table__head_row">
                <div
                    v-for="(headCell, index) in head"
                    :key="'hc'+index"
                    class="table__head_cell"
                >
                    <div :class="{'table__with_sort': headCell.type.toLowerCase() !== 'date'}">
                        <div class="table__sort" v-if="headCell.type.toLowerCase() !== 'date'">
                            <div class="table__sort_asc" @click="setSort(headCell.name, 'asc')"></div>
                            <div class="table__sort_desc" @click="setSort(headCell.name, 'desc')"></div>
                        </div>
    
                        {{ headCell.name }}
                    </div>
                </div>
            </div>
    
            <div
                v-for="(bodyRow, index) in bodyPage"
                :key="'br'+index"
                class="table__body_row"
            >
                <div
                    v-for="bodyCell in bodyRow"
                    :key="bodyCell.id"
                    class="table__body_cell"
                >{{ bodyCell }}</div>
            </div>
    
        </div>

        <div class="table__pagination" v-if="numberOfPages > 1">
            <div>Текущая страница <strong>{{ page }}</strong> из <strong>{{ numberOfPages }}</strong></div>
            <div class="table__page_btns">
                <div class="table__page_prev" @click="prev()"></div>
                <div class="table__page_next" @click="next()"></div>
            </div>
        </div>

        <div v-if="!bodyRows.length" class="table__not_found">Нет данных</div>

    </div>
</template>



<script>
export default {

    props: {

        tableData: {
            type: Object,
            default: () => ({})
        },

        filtersData: {
            type: Object,
            default: () => ({})
        },

    },

    data() {
        return {
            page: 1,
            itemsPerPage: 10,
            sortField: '',
            sortDirection: '',
        }
    },

    methods: {

        next() {
            this.page = this.page < this.numberOfPages ? this.page + 1 : this.page
        },

        prev() {
            this.page = this.page > 1 ? this.page - 1 : this.page
        },

        setSort(field, direction) {
            this.sortField = field
            this.sortDirection = direction
        },

    },

    computed: {

        head() {
            return this.tableData.head
        },

        body() {
            if ( this.sortField == '' && this.sortDirection == '' ) {
                return this.tableData.body
            }
            else {
                return this.tableData.body.sort((x, y) => {
                    if ( this.sortDirection === 'asc' ) {
                        if (x[this.sortField] < y[this.sortField]) return -1
                        if (x[this.sortField] > y[this.sortField]) return 1
                    }
                    if ( this.sortDirection === 'desc' ) {
                        if (x[this.sortField] > y[this.sortField]) return -1
                        if (x[this.sortField] < y[this.sortField]) return 1
                    }
                    return 0
                })
            }
        },

        bodyRows() {
            return this.body.filter((row) => {

                if ( this.filtersData.field && this.filtersData.condition && this.filtersData.searchString ) {

                    this.page = 1

                    if ( this.filtersData.condition === 'equal' ) {
                        return row[this.filtersData.field] == this.filtersData.searchString
                    }

                    if ( this.filtersData.condition === 'contains' ) {
                        const regExp = new RegExp('.*' + this.filtersData.searchString + '.*', 'i');
                        return regExp.test(row[this.filtersData.field])
                    }

                    if ( this.filtersData.condition === 'more' ) {
                        return row[this.filtersData.field] > this.filtersData.searchString
                    }

                    if ( this.filtersData.condition === 'less' ) {
                        return row[this.filtersData.field] < this.filtersData.searchString
                    }

                }
                else {
                    return row
                }

            })
        },

        bodyPage() {
            return this.bodyRows.slice(this.itemsPerPage * (this.page - 1), this.itemsPerPage + (this.itemsPerPage * (this.page - 1)))
        },

        numberOfPages() {
            return Math.ceil(this.bodyRows.length / this.itemsPerPage)
        },

    },
    
}
</script>



<style lang="scss" scoped>

.table {
    display: table;
    width: 100%;
    border-collapse: collapse;
    border-top: 1px solid #afafaf;
    border-left: 1px solid #afafaf;

    &__head_row {
        display: table-row;
    }

    &__head_cell {
        position: relative;
        display: table-cell;
        padding: 9px 15px;
        border-right: 1px solid #afafaf;
        border-bottom: 1px solid #afafaf;
        text-transform: capitalize;
        font-weight: bold;
        vertical-align: middle;
    }

    &__body_row {
        display: table-row;
    }

    &__body_cell {
        display: table-cell;
        padding: 9px 15px;
        border-right: 1px solid #afafaf;
        border-bottom: 1px solid #afafaf;
    }

    &__pagination {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 10px;
        padding: 15px 0px;
    }

    &__page_btns {
        display: flex;
        margin-left: 15px;
    }

    &__page_prev {
        margin-right: 10px;
        width: 40px;
        height: 36px;
        border: 1px solid #afafaf;
        border-radius: 4px;
        cursor: pointer;

        &:before {
            content: '';
            position: relative;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            display: block;
            width: 9px;
            height: 9px;
            border-left: 1px solid rgb(112, 112, 112);
            border-bottom: 1px solid rgb(112, 112, 112);
        }
    }

    &__page_next {
        width: 40px;
        height: 36px;
        border: 1px solid #afafaf;
        border-radius: 4px;
        cursor: pointer;

        &:before {
            content: '';
            position: relative;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(225deg);
            display: block;
            width: 9px;
            height: 9px;
            border-left: 1px solid rgb(112, 112, 112);
            border-bottom: 1px solid rgb(112, 112, 112);
        }
    }
    
    &__not_found {
        margin-top: 25px;
        padding: 9px 15px;
        text-align: center;
    }

    &__with_sort {
        display: flex;
        align-items: center;
    }

    &__sort {
        margin-right: 8px;
    }

    &__sort_asc {
        display: block;
        margin-bottom: 6px;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-bottom: 6px solid #000;
        cursor: pointer;
    }

    &__sort_desc {
        display: block;
        width: 0;
        height: 0;
        border: 6px solid transparent;
        border-top: 6px solid #000;
        cursor: pointer;
    }
    
}

</style>