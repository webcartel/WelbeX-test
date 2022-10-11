<template>
	<div id="app">

		<div class="mx-auto my-[50px] max-w-[1000px]">

			<div class="flex mb-[50px]">
				
				<select class="py-[5px] px-[10px] border-[2px] mr-[20px]" :class="{capitalize: filtersData.field }" v-model="filtersData.field">
					<option value="">Выберите поле для фильтрации</option>
					<option v-for="(headCell, index) in tableData.head" :key="index" :value="headCell.name" class="capitalize">{{ headCell.name }}</option>
				</select>

				<select class="py-[5px] px-[10px] border-[2px] mr-[20px]" v-if="filtersData.field" v-model="filtersData.condition">
					<option value="">Выберите условие</option>
					<option value="equal">Равно</option>
					<option value="contains" v-if="contains">Содержит</option>
					<option value="more" v-if="moreLess">Больше</option>
					<option value="less" v-if="moreLess">Меньше</option>
				</select>

				<input type="text" class="w-full py-[5px] px-[10px] border-[2px]" v-if="filtersData.field && filtersData.condition" v-model="filtersData.searchString" />

			</div>

			<Table :tableData="tableData" :filtersData="filtersData" />
		</div>

	</div>
</template>


<script>
import axios from 'axios';
import Table from '@/components/Table';

export default {

	name: 'App',

	components: {
		Table,
	},

	mounted () {
		this.getTableData()
	},

	data() {
		return {
			tableData: {
				head: [],
				body: [],
			},

			filtersData: {
				searchString: '',
				field: '',
				condition: '',
				fieldType: '',
			},
		}
	},

	methods: {

		getTableData() {
			axios({
				method: 'get',
				url: 'http://localhost:3000/',
			})
				.then((res) => {
					this.tableData = res.data
				})
		},

		getFieldType() {
			this.tableData.head.forEach((item) => {
				if ( item.name == this.filtersData.field ) {
					this.filtersData.fieldType = item.type.toLowerCase()
				}
			})
		},

	},

	computed: {

		moreLess() {
			return /int.*/.test(this.filtersData.fieldType) ? true : false
		},

		contains() {
			return this.filtersData.fieldType === 'string' ? true : false
		},

	},

	watch: {
		filtersData: {
			deep: true,
			handler: 'getFieldType',
		}
	},

}
</script>


<style lang="scss">
#app {
	
}
</style>
