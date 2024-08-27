<template>
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<div class="container">
    <h2>Add Node</h2>
    <hr>
    <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" v-model="form.Name" @blur="validateName">
        <span v-if="errors.Name" class="error">{{ errors.Name }}</span>
    </div>
    <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" name="description" v-model="form.Description" @blur="validateDescription"></textarea>
        <span v-if="errors.Description" class="error">{{ errors.Description }}</span>
    </div>
    <div class="form-group">
        <label class="switch">
            <input type="checkbox" v-model="isEnabled">
            <span class="slider round"></span>
            {{ isEnabled ? 'Enabled' : 'Disabled' }}
        </label>
        <br>
        <div>
            <select v-model="form.zone"  @blur="validateZone">
                <option value="">Select Zone</option>
                <option v-for="zone in zoneData" :key="zone.id" :value="zone.Z_Name">
                    {{ zone.Z_Name }}
                </option>
            </select>
            <span v-if="errors.zone" class="error">{{ errors.zone }}</span>
        </div>
        <br />
        <br>
        <button class="btn" @click="addnode()"><i class="fas fa-save"></i>Save</button>
    </div>
</div>
</template>

  
<script>
import axios from 'axios';
import Swal from 'sweetalert2'

export default {
    data() {
        var user_info = JSON.parse(localStorage.getItem('user-info'));
        return {
            zoneData: '',
            isEnabled: true, // default status is enabled
            form: {
                Name: '',
                Description: '',
                status: '',
                created_by: user_info.email,
                updated_by: '',
                zone: ''
            },
            errors: {
                Name: '',
                Description: '',
                zone: ''

            },
        };
    },
    methods: {
        validateName() {
            if (!this.form.Name) {
                this.errors.Name = 'Name is required';
            } else {
                this.errors.Name = '';
            }
        },
        validateDescription() {
            if (!this.form.Description) {
                this.errors.Description = 'Description is required';
            } else {
                this.errors.Description = '';
            }
        },
        validateZone() {
            if (!this.form.zone) {
                this.errors.zone = 'Zone is required';
            } else {
                this.errors.zone = '';

            }
        },
        async nodeExists(Name) {
            try {
                const response = await axios.get(`http://localhost:3000/node?Name=${(Name)}`);
                return response.data.length > 0; // Assuming the response is an array of zones
            } catch (error) {
                console.error('Error checking if Node exists:', error);
                return false;
            }
        },
        async addnode() {
            this.validateName();
            this.validateDescription();
            this.validateZone();

            if (this.errors.Name || this.errors.Description || this.errors.zone) {
                return;
            }
            if (await this.nodeExists(this.form.Name)) {
                this.errors.Name = 'A Node with this name already exists';
                return;
            }

            // if (this.isEnabled) {
            //     this.form.status = 'Enabled';
            // } else {
            //     this.form.status = 'Disabled';
            // }
            this.form.status = this.isEnabled ? 'enabled' : 'disabled';
          
                let result = await axios.post('http://localhost:3000/node', {
                    Name: this.form.Name,
                    Description: this.form.Description,
                    status: this.form.status,
                    created_by: this.form.created_by,
                    updated_by: this.form.updated_by,
                    zone: this.form.zone
                });

                if (result.status === 201) {
                  // await swal("Success!","Add Node successfully","success")
                  const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "success",
                    title: ("Add Node successfully")
                });

                    this.$router.push({
                        name: 'Node'
                    });
                }
          },
    
    },
    async mounted() {
        try {
            let zones = await axios.get('http://localhost:3000/zone?status=enabled');
            this.zoneData = zones.data;
        } catch (error) {
            console.error(error);
            // Handle error
        }
    }
};
</script>

  
<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: linear-gradient(135deg, #f9f9f9, #e0e0e0);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="text"]:focus,
textarea:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.error {
  color: red;
  font-size: 0.875em;
  margin-top: 5px;
}

.switch {
  display: flex;
  align-items: center;
}

.switch input {
  display: none;
}

.slider {
  position: relative;
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.slider:before {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  background-color: white;
  border-radius: 50%;
  top: 1px;
  left: 1px;
  transition: transform 0.2s;
}

input:checked + .slider {
  background-color: #4caf50;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.btn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: linear-gradient(135deg, #f9f9f9, #e0e0e0);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="text"]:focus,
textarea:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.error {
  color: red;
  font-size: 0.875em;
  margin-top: 5px;
}

.switch {
  display: flex;
  align-items: center;
}

.switch input {
  display: none;
}

.slider {
  position: relative;
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.slider:before {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  background-color: white;
  border-radius: 50%;
  top: 1px;
  left: 1px;
  transition: transform 0.2s;
}

input:checked + .slider {
  background-color: #4caf50;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  display: flex;
  align-items: center;
}

.btn i {
  margin-right: 8px;
}

.btn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}


</style>  
