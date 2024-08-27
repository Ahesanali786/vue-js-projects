<template>
<!-- <Add /> -->
<!-- HTML !-->
<logout />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<div class="container">
    <!-- <div class="tabs"> -->
    <a href="/home"><button class="tab">Zone</button>
    </a>
    <a href="/node"><button class="tab">Node</button>
    </a>
    <div class="add">
        <a href="/AddNode"><button class="add-none">+ Add Node</button>
        </a>
        <!-- <a href="/"><button class="tab" @click="LogOut()">LogOut</button></a> -->
    </div>
</div>

<div class="container">
    <button v-if="selectedItems.length > 0" @click="deleteSelected" class="delete-button"><i class="fa fa-trash"></i> Delete</button>
    <input type="text" v-model="searchQuery" placeholder="Search by Node Name" class="search-bar">
    <button @click="printPdf" class="print-button"><i class="fa fa-print"></i> Print</button>
</div>
<table class="table">
    <thead>
        <tr>
            <th scope="col"><input type="checkbox" @change="selectAll($event)" /></th>
            <th scope="col">id</th>
            <th scope="col">N_NAME</th>
            <th scope="col">N_desc</th>
            <th scope="col">status</th>
            <th scope="col">zone</th>
            <th scope="col">created_by</th>
            <th scope="col">Updated_by</th>
            <th scope="col">Action</th>
        </tr>
        <tr v-for="item in   filterNode" :key="item.id">
            <td><input type="checkbox" v-model="selectedItems" :value="item.id" /></td>
            <td>{{ item.id }}</td>
            <td>{{ item.Name }}</td>
            <td>{{ item.Description }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.zone }}</td>
            <td>{{ item.created_by }}</td>
            <td>{{ item.updated_by }}</td>
            <td>
                <router-link :to="'/updatednode/' + item.id"><i id="hey1" class="bi bi-pencil-square"></i></router-link>
                <i id="hey" @click="delnode(item.id)" class="bi bi-trash-fill"></i>
            </td>

        </tr>
    </thead>
</table>
<!-- <div class="pagination-container">
    <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">Previous</button>
    <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">Next</button>
</div> -->
</template>

<script>
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Logout from './logout.vue';
import Swal from 'sweetalert2';

export default {
    components: {
        Logout
    },

    data() {
        return {
            name: '',
            node: [],
            user: [],
            searchQuery: '',
            selectedItems: [],
            // currentPage: 1,
            // itemsPerPage: 5

        }
    },
    computed: {
        filterNode() {
            return this.node.filter(item => {
                return item.Name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.status.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.zone.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    item.created_by.toLowerCase().includes(this.searchQuery.toLowerCase())
            });
        },
        // paginatedZones() {
        //     const start = (this.currentPage - 1) * this.itemsPerPage;
        //     const end = start + this.itemsPerPage;
        //     return this.filterNode.slice(start, end);
        // },
        // totalPages() {
        //     return Math.ceil(this.filterNode.length / this.itemsPerPage);
        // }
    },
    methods: {
        async delnode(id) {

            let result = await axios.delete("http://localhost:3000/node/" + id)
            if (result.status == 200) {
                this.load()
            }
        },
        async deleteSelected() {
            // Show confirmation dialog
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                // Proceed with deletion if confirmed
                for (let id of this.selectedItems) {
                    await this.delnode(id);
                }
                this.selectedItems = [];

                // Show success message
                Swal.fire(
                    'Deleted!',
                    'Your selected zones have been deleted.',
                    'success'
                );
            }
        },

        async load() {
            let user = localStorage.getItem('user-info')

            if (!user) {
                this.$router.push({
                    name: 'Login',
                })
            } else {
                this.name = JSON.parse(user).name
                let result = await axios.get("http://localhost:3000/node")
                this.node = result.data;
                // console.log(result.data);
                
            }
        },
        // LogOut() {
        //     localStorage.removeItem('user-info')
        //     this.$router.push({
        //         name: 'Login',
        //     })
        // },
        selectAll(event) {
            if (event.target.checked) {
                this.selectedItems = this.zone.map(item => item.id);
            } else {
                this.selectedItems = [];
            }
        },
        async printPdf() {
            const doc = new jsPDF();
            const table = document.querySelector('table');
            const canvas = await html2canvas(table);
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 5, 35, 189, 200);
            doc.save('table-data.pdf');
        },
    // nextPage() {
    //     if (this.currentPage < this.totalPages) {
    //       this.currentPage++;
    //     }
    //   },
    //   prevPage() {
    //     if (this.currentPage > 1) {
    //       this.currentPage--;
    //     }
    //   }
    },
    mounted() {
        this.load()

    }
}
</script>

<style>
#hey {
    transition: color 0.3s ease-in-out;
    margin-left: 20px;
    margin-right: auto;
    cursor: pointer;
    font-size: 1.3em;

    &:hover {
        color: #ff0000;
    }
}

#hey1 {
    transition: color 0.3s ease-in-out;
    margin-right: auto;
    margin-left: 10px;
    cursor: pointer;
    font-size: 1.3em;

    &:hover {
        color: #15c326;
    }
}

body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;
}

.container {
    width: 90%;
    margin: 20px auto;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

}

.tab,
.add-none {
    padding: 10px 20px;
    margin-right: 10px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    border-radius: 5px;
}

.add-none {
    background-color: #28a745;
}

.controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.controls select,
.controls button,
.controls input {
    margin-right: 10px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

table,
th,
td {
    border: 1px solid #ddd;
}

th,
td {
    padding: 10px;
    text-align: left;
}

th {
    background-color: #f8f8f8;
}

.pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pagination button {
    padding: 5px 10px;
    border: 1px solid #ccc;
    background-color: #fff;
    cursor: pointer;
    border-radius: 5px;
}

.pagination span {
    padding: 5px 10px;
}

.search-bar {
    width: 25%;
    padding: 8px 14px;
    margin: 4px 0;
    box-sizing: border-box;
    border: 3px solid #ccc;
    border-radius: 4px;
}
</style>
