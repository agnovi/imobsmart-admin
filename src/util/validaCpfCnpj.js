export default {
  data() {
    return { errorCPF: true, errorCnpj: true };
  },
  methods: {
    validaCpfCnpj(elemento) {
      if (!elemento)return false
      const el = elemento.replace(/[^\d]+/g, "");
      if (el.length === 11) {
        return this.testaCPF(el);
      } else if (el.length === 14) {
       return this.testaCNPJ(el);
      }
    },
    testaCPF(elemento) {

      const cpf = elemento;

      if (cpf.length === 11) {
        // Elimina CPFs invalidos conhecidos
        if (
          cpf.length !== 11 ||
          cpf === "00000000000" ||
          cpf === "11111111111" ||
          cpf === "22222222222" ||
          cpf === "33333333333" ||
          cpf === "44444444444" ||
          cpf === "55555555555" ||
          cpf === "66666666666" ||
          cpf === "77777777777" ||
          cpf === "88888888888" ||
          cpf === "99999999999"
        ) {
          this.$swal({
            text: "CPF invalido!",
            icon: "warning",
          });
          this.errorCPF = true;
          return false;
        }

        // Valida 1o digito
        let add = 0;
        let rev;
        for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(9))) {
          this.$swal({
            text: "CPF invalido!",
            icon: "warning",
          });
          this.errorCPF = true;
          return false;
        }

        add = 0;
        for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(10))) {
          this.$swal({
            text: "CPF invalido!",
            icon: "warning",
          });
          this.errorCPF = true;
          return false;
        } else {
          // this.$swal.success('CPF válido!')
          // this.errorCPF = false
          // this.errorCnpj = false
          this.errorCPF = false;
          return true;
        }
      }
    },

    testaCNPJ(elemento) {
      const cnpj = elemento;

      if (cnpj === "") {
        this.$swal({
          text: "CNPJ invalido!",
          icon: "error",
        });
        this.errorCnpj = true;
        return false;
      }

      if (cnpj.length !== 14) {
        this.$swal({
          text: "CNPJ invalido!",
          icon: "warning",
        });
        this.errorCnpj = true;
        return false;
      }
      // Elimina CNPJs invalidos conhecidos
      if (
        cnpj === "00000000000000" ||
        cnpj === "11111111111111" ||
        cnpj === "22222222222222" ||
        cnpj === "33333333333333" ||
        cnpj === "44444444444444" ||
        cnpj === "55555555555555" ||
        cnpj === "66666666666666" ||
        cnpj === "77777777777777" ||
        cnpj === "88888888888888" ||
        cnpj === "99999999999999"
      ) {
        this.$swal({
          text: "CNPJ invalido!",
          icon: "warning",
        });
        this.errorCnpj = true;
        return false;
      }
      // Valida DVs
      let tamanho = cnpj.length - 2;
      let numeros = cnpj.substring(0, tamanho);
      const digitos = cnpj.substring(tamanho);
      let soma = 0;
      let pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
      }
      let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado != digitos.charAt(0)) {
        this.$swal({
          text: "CNPJ invalido!",
          icon: "warning",
        });
        this.errorCnpj = true;
        return false;
      }
      tamanho = tamanho + 1;
      numeros = cnpj.substring(0, tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
      }
      resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado != digitos.charAt(1)) {
        this.$swal({
          text: "CNPJ invalido!",
          icon: "error",
        });
        this.errorCnpj = true;
        return false;
      }
      // this.$swal({
      //   text: "CNPJ valido!",
      //   icon: "success",
      // });
      this.errorCnpj = false;
      this.errorCPF = false;
      return true;
    },
  },
};
