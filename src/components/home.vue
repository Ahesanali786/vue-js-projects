<template>
    <logout />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <div class="container">
      <button class="tab">Zone</button>
      <a href="/node"><button class="tab">Node</button></a>
      <div class="add">
        <a href="/Add"><button class="add-zone">+ Add Zone</button></a>
      </div>
      <hr />
    </div>
    <div class="container">
      <input type="text" v-model="searchQuery" placeholder="Search..." class="search-bar" />
      <button v-if="selectedItems.length > 0" @click="deleteSelected()" class="delete-button"><i class="fa fa-trash"></i> Delete</button>
      <button @click="printPdf" class="print-button"><i class="fa fa-print"></i> Print</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col"><input type="checkbox" @change="selectAll($event)" /></th>
          <th scope="col">id</th>
          <th scope="col">Z_NAME</th>
          <th scope="col">Z_desc</th>
          <th scope="col">status</th>
          <th scope="col">created_by</th>
          <th scope="col">Updated_by</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in  filteredZones" :key="item.id">
          
          <td><input type="checkbox" v-model="selectedItems" :value="item.id" /></td>
          <td>{{ item.id }}</td>
          <td>{{ item.Z_Name }}</td>
          <td>{{ item.Z_Description }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.created_by }}</td>
          <td>{{ item.updated_by }}</td>
          <td>
            <router-link :to="'/updatedby/' + item.id"><i id="hey1" class="bi bi-pencil-square"></i></router-link>
            <i id="hey" @click="deletresto(item.id)" class="bi bi-trash-fill"></i>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <div class="pagination-container">
    <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button"><i class="fa fa-arrow-left"></i>Previous</button>
    <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">Next<i class="fa fa-arrow-right"></i></button>
  </div> -->
  </template>
  
<script>
  import axios from 'axios';
  import jsPDF from 'jspdf';
  import html2canvas from 'html2canvas';
  import Logout from './logout.vue';
  import Swal from 'sweetalert2'; // Import SweetAlert2
  
  export default {
    components: {
      Logout
    },
    data() {
      return {
        name: '',
        zone: [],
        searchQuery: '',
        user: [],
        selectedItems: [],
        // currentPage: 1,
        // itemsPerPage: 5
      }
    },
    computed: {
      filteredZones() {
        return this.zone.filter(item => {
          return item.Z_Name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.status.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.created_by.toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      },
      // paginatedZones() {
      //   const start = (this.currentPage - 1) * this.itemsPerPage;
      //   const end = start + this.itemsPerPage;
      //   return this.filteredZones.slice(start, end);
      // },
      // totalPages() {
      //   return Math.ceil(this.filteredZones.length / this.itemsPerPage);
      // }
    },
    methods: {
      async deletresto(id) {
        try {
        let result = await axios.get("http://localhost:3000/zone/" + id);
        let nodeName = await axios.get(`http://localhost:3000/node?zone=${result.data.Z_Name}`);

        if(nodeName.data.length === 0){
          await axios.delete("http://localhost:3000/zone/" + id);
          Swal.fire(
            'Deleted!',
            'Your zone has been deleted.',
           'success'
          )
        }
          else {
            Swal.fire(
              'Error!',
              'Zone cannot be deleted as it has associated nodes.',
              'error'
            )
          }
          this.load()
        }catch (error) {
          console.error(error);
          Swal.fire(
            'Error!',
            'Failed to delete zone.',
            'error'
          )
        }
      //   if (result.status == 200) {
      //     this.load();
      //   }
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
            await this.deletresto(id);
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
        let user = localStorage.getItem('user-info');
        if (!user) {
          this.$router.push({
            name: 'Login'
          });
        } else {
      

          // let result = await axios.get("http://localhost:3000/zone");
          let result = await axios.get("http://localhost:3000/zone");
          this.zone = result.data;
        }
      },
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
    
    },
    mounted() {
      this.load();
    }
  }
  </script>
  
<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

.container {
    margin: 20px;
}

.tabs {
    display: flex;
    gap: 10px;
}

.tab,
.add-zone,
.delete-button {
    background-color: #4CAF50;
    /* Green */
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.tab:hover,
.add-zone:hover,
.delete-button:hover {
    background-color: #45a049;
    text-decoration: underline;
    color: black;
}

.search-bar {
    width: 25%;
    padding: 8px 14px;
    margin: 4px 0;
    box-sizing: border-box;
    border: 3px solid #ccc;
    border-radius: 4px;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th,
.table td {
    border: 1px solid #ddd;
    padding: 8px;
}

.table th {
    background-color: #f2f2f2;
    text-align: left;
}

.delete-button {
    margin-left: 100px;
    cursor: pointer;
    background-color: red;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    border-radius: 4px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #ff3333;
        color: white;

    }
}

.print-button {
    margin: 10px;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.print-button i {
    margin-right: 5px;
}

.add {
    margin-top: -50px;
    margin-left: 100px;
    display: flex;
    justify-content: flex-end;
}

.tab:hover {
    text-decoration: underline;
    color: black;
}
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
}

.pagination-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination-button:not(:disabled):hover {
  background-color: #0056b3;
}

.pagination-button i {
  margin: 0 5px;
}

.pagination-info {
  font-size: 16px;
  font-weight: bold;
}
</style>
