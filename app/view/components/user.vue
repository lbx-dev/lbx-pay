<style scoped>

</style>
<script>
  const emailRegex = new RegExp('^([A-Za-z0-9._%+-]|"|”|“|\\\\| |“.*”){0,64}([A-Za-z0-9_%+-]|"|”|“|\\\\| |“.*”)@[A-Za-z0-9][A-Za-z0-9.-]*\\.[A-Za-z]{2,}$');
  export default {
    name: 'UserCard',
    props: {
      user: {
        type: Object,
        default: () => {
        }
      },
      deleteUser: {
        type: Function,
        default: () => {
        }
      },
      saveUser: {
        type: Function,
        default: () => {
        }
      },
      toggleEditable: {
        type: Function,
        default: () => {
        }
      },
      switchDisabled: {
        type: Function,
        default: () => {
        }
      },
      switching: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const roles = this.$store.getters.getRoles;

      return {
        id: this.user.id,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        firstNameRules: [
          v => !!v || 'First name is required',
          v => v.length < 128 || 'First name is too large'
        ],
        lastNameRules: [
          v => !!v || 'Last name is required',
          v => v.length < 128 || 'Last name is too large'
        ],
        emailRules: [
          v => !!v || 'E-mail is required',
          v => emailRegex.test(v) || 'E-mail must be valid'
        ],
        roles,
        selectedRole: this.user.roleId
      };
    },
    computed: {
      preventSubmission() {
        return !(
          this.firstName &&
          this.firstName.length < 128 &&
          this.lastName &&
          this.lastName.length < 128 &&
          this.email &&
          emailRegex.test(this.email)
        );
      }
    },
    watch: {
      user: {
        deep: true,
        handler(newUser) {
          if(!newUser.editable) {
            this.firstName = newUser.firstName;
            this.lastName = newUser.lastName;
            this.email = newUser.email;
            this.selectedRole = newUser.roleId;
          }
        }
      }
    }
  };
</script>
<template>
  <v-card class="ma-3">
    <v-card-title>
      <h4>
        {{ user.roleName }}
      </h4>
      <v-divider v-show="!user.editable" />
      <v-btn
        v-show="!user.editable"
        flat
        outline
        color="accent"
        @click="toggleEditable(id)">
        <span>
          edit
        </span>
      </v-btn>
    </v-card-title>
    <v-divider />
    <v-card-text v-show="user.editable">
      <v-form
        @keyup.enter.native="() => { if(preventSubmission) { return; } saveUser(id, {firstName, lastName, email, password, roleId: selectedRole}); }">
        <v-text-field
          v-model="firstName"
          :rules="firstNameRules"
          label="First name"
          required />
        <v-text-field
          v-model="lastName"
          :rules="lastNameRules"
          label="Last name"
          required />
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          required />
        <v-select
          v-model="selectedRole"
          :items="roles"
          item-text="name"
          item-value="id"
          label="Role" />
        <v-card-actions>
          <v-spacer />
          <v-btn
            flat
            color="accent"
            @click="toggleEditable(id)">
            Cancel
          </v-btn>
          <v-btn
            color="accent"
            :disabled="preventSubmission"
            @click="saveUser(id, {firstName, lastName, email, password, roleId: selectedRole})">
            <span v-show="user.saving">
              Saving
            </span>
            <span v-show="!user.saving">
              Save
            </span>
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
    <v-list
      v-show="!user.editable"
      dense>
      <v-list-tile>
        <v-list-tile-content>First name:</v-list-tile-content>
        <v-list-tile-content class="align-end">
          {{ user.firstName }}
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>Last name:</v-list-tile-content>
        <v-list-tile-content class="align-end">
          {{ user.lastName }}
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>Email:</v-list-tile-content>
        <v-list-tile-content class="align-end">
          {{ user.email }}
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>Confirmed:</v-list-tile-content>
        <v-list-tile-content class="align-end">
          {{ user.confirmed }}
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>Disabled:</v-list-tile-content>
        <v-list-tile-content class="align-end">
          {{ user.disabled }}
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>Delete:</v-list-tile-content>
        <v-list-tile-content class="align-end">
          <v-btn
            color="accent"
            :disabled="user.deleting"
            @click="deleteUser(user.id)">
            <span v-if="user.deleting">
              deleting
            </span>
            <span v-else>
              delete
            </span>
          </v-btn>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content class="align-end">
          <v-btn
            color="accent"
            :disabled="user.switching"
            @click="switchDisabled(user.id)">
            <span v-show="user.switching">
              please wait
            </span>
            <span v-show="!user.switching && user.disabled">
              enable
            </span>
            <span v-show="!user.switching && !user.disabled">
              disable
            </span>
          </v-btn>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile />
    </v-list>
  </v-card>
</template>
