$(document).ready(function () {
    let queryString = new URLSearchParams(window.location.search);      // ??
    if (queryString.has('id')) {    // ??
        populateAgentDetails();
    }
    // Display State and Area Code depending on selected country
    var el = document.getElementById("selectCountry");
    el.addEventListener("change", function () {
        var elems = document.querySelectorAll('#auState,#nzState,#auAreaCode,#nzAreaCode');
        for (var i = 0; i < elems.length; i++) {
            elems[i].style.display = 'none';
        }
        if (this.selectedIndex === 1) {
            document.querySelector('#auState').style.display = 'block';
            document.querySelector('#auAreaCode').style.display = 'block';
        } else if (this.selectedIndex === 2) {
            document.querySelector('#nzState').style.display = 'block';
            document.querySelector('#nzAreaCode').style.display = 'block';
        }
    }, false);

    // Integrate datepicker with bootstrapValidator
    $('.dateRangePicker').datepicker({
        format: 'dd/mm/yyyy',
        endDate: '-1d'
    }).on('changeDate', function (e) {
        $('#contact_form').bootstrapValidator('updateStatus', 'dob', 'NOT_VALIDATED').bootstrapValidator('validateField', 'dob');
    });

    $('#contact_form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            title: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your title'
                    },
                }
            },
            first_name: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please supply your first name'
                    },
                    different: {
                        message: 'The First Name cannot be the same as Last Name',
                        field: 'last_name'
                    },
                    callback: {
                        message: 'Please enter only letters',
                        callback: function (value, validator) {
                            if (!isValid(value)) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                }
            },
            last_name: {
                validators: {
                    stringLength: {
                        min: 2,
                    },
                    notEmpty: {
                        message: 'Please supply your last name'
                    },
                    different: {
                        message: 'The First Name cannot be the same as Last Name',
                        field: 'first_name'
                    },
                    callback: {
                        message: 'Please enter only letters',
                        callback: function (value, validator) {
                            if (!isValid(value)) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                }
            },
            dob: {
                validators: {
                    notEmpty: {
                        message: 'Required field'
                    },
                    date: {
                        message: 'Invalid date',
                        format: 'DD/MM/YYYY',
                        min: '01/01/1800',
                        max: new Date()
                    },
                    callback: {
                        message: 'Restrict age between 18-65',
                        callback: function (value, validator) {
                            var dayMonthYearDate = moment(value, "DD/MM/YYYY");
                            let yearMonthDayDate = moment(dayMonthYearDate).format("YYYY/MM/DD");
                            let age = getAge(yearMonthDayDate);
                            if (age >= 18 && age <= 65) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your email address'
                    },
                    identical: {
                        message: 'The email and its confirm are not the same',
                        field: 'confirm_email'
                    },
                    emailAddress: {
                        message: 'Please supply a valid email address'
                    }
                }
            },
            confirm_email: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your email address'
                    },
                    identical: {
                        message: 'The email and its confirm are not the same',
                        field: 'email'
                    },
                    emailAddress: {
                        message: 'Please supply a valid email address'
                    }
                }
            },
            // state: {
            //     validators: {
            //         notEmpty: {
            //             message: 'Please select your state'
            //         }
            //     }
            // },
            // zip: {
            //     validators: {
            //         notEmpty: {
            //             message: 'Please supply your zip code'
            //         },
            //         zipCode: {
            //             country: 'US',
            //             message: 'Please supply a vaild zip code'
            //         }
            //     }
            // }
        }
    });
    // Disable Copy + Paste for email confirmation
    $('input[name="confirm_email"]').on("cut copy paste",function(e) {
        e.preventDefault();
    });

    $('#contact_form').submit(function (e) {
        if (e.isDefaultPrevented()) {       // ??
            return;
        }
        e.preventDefault();         // ??
        let agents = getStorageItem('agents');
        let isEditMode = false;
        if (this.id) {      //  ??
            let id = parseInt(this.id.value);
            let agent = agents.find(agent => agent.id === id);
            if (agent) {
                isEditMode = true;
                agent.id = id,
                agent.title = this.title.value,
                agent.firstName = this.first_name.value,
                agent.lastName = this.last_name.value,
                agent.dob = this.dob.value,
                agent.phone = this.phone.value,
                agent.email = this.email.value,
                agent.address1 = this.address1.value,
                agent.address2 = this.address2.value,
                agent.city = this.city.value,
                agent.country = this.country.value,
                agent.au_state = this.au_state.value,
                agent.nz_state = this.nz_state.value,
                agent.area_code_phone = this.area_code_phone.value,
                agent.postcode = this.postcode.value,
                agent.email = this.email.value,
                agent.status = 'active'
            }
        }

        if (!isEditMode) {
            let newAgent = {
                id: getMaxId(agents) + 1,
                title: this.title.value,
                firstName: this.first_name.value,
                lastName: this.last_name.value,
                dob: this.dob.value,
                phone: this.phone.value,
                address1: this.address1.value,
                address2: this.address2.value,
                city: this.city.value,
                country: this.country.value,
                au_state: this.au_state.value,
                nz_state: this.nz_state.value,
                area_code_phone: this.area_code_phone.value,
                postcode: this.postcode.value,
                email: this.email.value,
                status: 'active'
            };
            agents.push(newAgent);
        }

        setStorageItem('agents', agents);       // Update agents

        window.location.href = "01_MyAgents.html";
    });

    function getMaxId(agents) {
        let maxId = 0;
        let agentIds = agents.map(agent => agent.id);       // <<
        if (agentIds.length > 0) {
            maxId = agentIds.reduce((a, b) => {         // <<
                return Math.max(a, b);
            });
        }
        return maxId;
    }

    function populateAgentDetails() {
        let idValue = queryString.get('id');
        let id = parseInt(idValue);
        if (!Number.isInteger(id)) {
            return;
        }
        let agents = getStorageItem('agents');
        let agent = agents.find(agent => agent.id === id);
        if (!agent) {
            return;
        }
        let form = $('#contact_form');
        form.find('input[name="id"]').val(agent.id);
        form.find('select[name="title"]').val(agent.title);
        form.find('input[name="first_name"]').val(agent.firstName);
        form.find('input[name="last_name"]').val(agent.lastName);
        form.find('input[name="dob"]').val(agent.dob);
        form.find('input[name="phone"]').val(agent.phone);
        form.find('input[name="address1"]').val(agent.address1);
        form.find('input[name="address2"]').val(agent.address2);
        form.find('input[name="city"]').val(agent.city);
        form.find('select[name="country"]').val(agent.country);
        form.find('select[name="au_state"]').val(agent.au_state);
        form.find('select[name="nz_state"]').val(agent.nz_state);
        form.find('input[name="area_code_phone"]').val(agent.area_code_phone);
        form.find('input[name="postcode"]').val(agent.postcode);
        form.find('input[name="email"]').val(agent.email);
        form.find('input[name="status"]').val(agent.status);
    }

    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    function isValid(value) {
        var fieldNum = /^[a-z]+$/i;
        if ((value.match(fieldNum))) {
            return true;
        } else {
            return false;
        }
    }
});
