<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <section class="h-100 h-custom bg-light">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col d-flex justify-content-center align-items-center">
            <div class="card border-0 shadow-lg" style="min-width:350px; max-width:500px; border-radius: 15px;">
              <div class="card-body p-5">
                <h3 class="mb-4 text-center">Log In</h3>
                <hr />
                <div v-if="v$.$errors.length > 0" class="alert alert-danger" role="alert">
                  <ul>
                    <li v-for="error of v$.$errors" :key="error.$uid">
                      <strong>{{ error.$validator }}</strong>
                      <small> on property </small>
                      <strong>{{ error.$property }}</strong>
                      <small> says: </small>
                      <strong>{{ error.$message }}</strong>
                    </li>
                  </ul>
                </div>
                <form @submit="login">
                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" v-model.trim="form.email" @input="setTouched('email')" :class="v$.form.email.$error?'is-invalid':''">
                    <div v-for="error of v$.form.email.$errors" class="invalid-feedback" :key="error.$uid">
                      {{ error.$message }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" v-model.trim="form.password" @input="setTouched('password')" :class="v$.form.password.$error?'is-invalid':''">
                    <div v-for="error of v$.form.password.$errors" class="invalid-feedback" :key="error.$uid">
                      {{ error.$message }}
                    </div>
                  </div>
                  <div class="mb-3 text-center">
                    <button class="btn btn-primary btn-block"> <i class="fa fa-lock icon"></i> Login</button><br /><br />
                  </div>
                  <hr />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>

    
<script>
import axios from 'axios';
import useVuelidate from '@vuelidate/core'
import swal from 'sweetalert'
import {required,email,sameAs,between,minValue,maxValue,alpha,numeric,helpers,minLength,maxLength} from '@vuelidate/validators'

export default {
    name: 'Login',
    setup() {
        return {
            v$: useVuelidate()
        }
    },
    data() {
        return {
            form: {
                email: '',
                password: '',
            },
        }
    },
    validations() {
        return {
            form: {

                email: {
                    required,
                    email
                },
                password: {
                    required,
                },
            },
        }
    },
    methods: {
        setTouched(theModel) {
            // if(theModel == 'name' || theModel == 'all'){this.v$.form.name.$touch()} 
            if (theModel == 'email' || theModel == 'all') {
                this.v$.form.email.$touch()
            }
            if (theModel == 'password' || theModel == 'all') {
                this.v$.form.password.$touch()
            }
        },

        async login(e) {
            e.preventDefault();

            this.setTouched('all');
            if (!this.v$.$invalid) {
                let result = await axios.get(`http://localhost:3000/user?email=${this.form.email}&password=${this.form.password}`

                );
                console.log(result);
                if (result.data == '') {
                    swal("Oops! Something went wrong","email is incorrect" , "error");
                }
                else if (result.data[0].password != this.form.password) {
                    swal("Oops! Something went wrong","gher ja topa password khoto se" ,"error");
                }
                
                
                else if (this.form.email == result.data[0].email && this.form.password == result.data[0].password) {
                    localStorage.setItem("user-info", JSON.stringify(result.data[0]))
                    this.$router.push({
                        name: 'home'
                    })
                    alert("Welcome to my home")
                };
            }
        },
    },
    mounted() {
        let user = localStorage.getItem('user-info')
        if (user) {
            this.$router.push({
                name: 'home'
            })
        }
    },
}
</script>

<style >
.h-custom {
  height: calc(100% - 73px);
}

.card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.card-body {
  padding: 2rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: background-color 0.3s, border-color 0.3s;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.form-control {
  border-radius: 10px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-label {
  font-weight: bold;
}

.invalid-feedback {
  display: block;
}

.alert {
  border-radius: 10px;
}

.icon {
  margin-right: 5px;
}
</style>