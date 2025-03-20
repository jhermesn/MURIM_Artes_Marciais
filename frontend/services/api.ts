// Configuração base para chamadas à API
const API_URL = "http://localhost/backend"

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`

  let token = null

  if (typeof window !== "undefined") {
    token = localStorage.getItem("auth_token")
  }

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  options.headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  }

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await response.json()
          throw new Error(errorData.error || errorData.message || `Erro na requisição: ${response.status}`)
        } catch (jsonError) {
          throw new Error(`Erro na requisição: ${response.status}`)
        }
      } else {
        throw new Error(
            `Erro na requisição: ${response.status}. O servidor pode estar indisponível ou o endpoint incorreto.`,
        )
      }
    }

    // Para requisições que não retornam JSON (como DELETE)
    if (response.status === 204) {
      return null
    }

    // Verificar se a resposta é JSON antes de tentar fazer o parse
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      try {
        return await response.json()
      } catch (error) {
        console.error("Erro ao fazer parse do JSON:", error)
        return { success: false, message: "Erro ao processar resposta do servidor" }
      }
    } else {
      console.warn("A resposta não é do tipo JSON:", contentType)
      return { message: "Resposta recebida, mas não é do tipo JSON" }
    }
  } catch (error) {
    console.error("Erro na API:", error)
    throw error
  }
}

// Serviço de autenticação
export const authService = {
  // Registrar um novo usuário
  async register(userData: {
    nome_completo: string
    email: string
    telefone: string
    senha: string
  }) {
    return fetchApi("/api/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  // Login de usuário
  async login(credentials: { email: string; senha: string }) {
    const data = await fetchApi("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    // Salvar o token no localStorage
    if (data.token) {
      localStorage.setItem("auth_token", data.token)
    }

    return data
  },

  // Logout de usuário
  async logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }

    try {
      await fetchApi("/api/logout", { method: "POST" })
    } catch (error) {
      console.error("Erro ao fazer logout na API:", error)
    }
  },

  // Obter perfil do usuário
  async getProfile() {
    return fetchApi("/api/profile")
  },

  // Atualizar perfil do usuário
  async updateProfile(userData: any) {
    return fetchApi("/api/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  },
}

// Serviço de mensagens
export const messageService = {
  async sendMessage(messageData: {
    nome_completo: string
    email: string
    telefone: string
    assunto: string
    mensagem: string
  }) {
    return fetchApi("/api/mensagens", {
      method: "POST",
      body: JSON.stringify(messageData),
    })
  },

  // Listar todas as mensagens (somente admin)
  async getAllMessages() {
    try {
      return await fetchApi("/api/mensagens")
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error)

      return {
        "hydra:member": [],
        "hydra:totalItems": 0,
      }
    }
  },

  // Obter o total de mensagens não lidas
  async getUnreadMessagesCount() {
    try {
      const response = await fetchApi("/api/mensagens/unread/count")
      return response.count || 0
    } catch (error) {
      console.error("Erro ao buscar contagem de mensagens não lidas:", error)
      return 0
    }
  },

  // Marcar uma mensagem como lida
  async markAsRead(id: number) {
    return fetchApi(`/api/mensagens/${id}/read`, {
      method: "PATCH",
    })
  },

  // Excluir uma mensagem
  async deleteMessage(id: number) {
    return fetchApi(`/api/mensagens/${id}`, {
      method: "DELETE",
    })
  },
}

// Serviço de usuários (admin)
export const userService = {
  // Listar todos os usuários
  async getAllUsers() {
    try {
      return await fetchApi("/api/usuarios")
    } catch (error) {
      console.error("Erro ao buscar usuários:", error)
      return {
        "hydra:member": [],
        "hydra:totalItems": 0,
      }
    }
  },

  // Atualizar usuário
  async updateUser(id: number, userData: any) {
    return fetchApi(`/api/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  },

  // Excluir usuário
  async deleteUser(id: number) {
    return fetchApi(`/api/usuarios/${id}`, {
      method: "DELETE",
    })
  },

  // Obter estatísticas de usuários (total, por cargo, etc.)
  async getUserStats() {
    try {
      return await fetchApi("/api/usuarios/stats")
    } catch (error) {
      console.error("Erro ao buscar estatísticas de usuários:", error)
      return {
        total: 0,
        alunos: 0,
        admin: 0,
      }
    }
  },
}

// Serviço de horários
export const scheduleService = {
  // Obter todos os horários
  async getAllSchedules() {
    try {
      return await fetchApi("/api/horarios")
    } catch (error) {
      console.error("Erro ao buscar horários:", error)
      return {
        "hydra:member": [],
        "hydra:totalItems": 0,
      }
    }
  },

  // Criar novo horário (admin)
  async createSchedule(scheduleData: any) {
    return fetchApi("/api/horarios", {
      method: "POST",
      body: JSON.stringify(scheduleData),
    })
  },

  // Atualizar horário (admin)
  async updateSchedule(id: number, scheduleData: any) {
    return fetchApi(`/api/horarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(scheduleData),
    })
  },

  // Excluir horário (admin)
  async deleteSchedule(id: number) {
    return fetchApi(`/api/horarios/${id}`, {
      method: "DELETE",
    })
  },
}

// Serviço de produtos (vestuário)
export const productService = {
  // Obter todos os produtos
  async getAllProducts() {
    try {
      return await fetchApi("/api/produtos")
    } catch (error) {
      console.error("Erro ao buscar produtos:", error)
      return {
        "hydra:member": [],
        "hydra:totalItems": 0,
      }
    }
  },

  // Criar novo produto (admin)
  async createProduct(productData: any) {
    return fetchApi("/api/produtos", {
      method: "POST",
      body: JSON.stringify(productData),
    })
  },

  // Atualizar produto (admin)
  async updateProduct(id: number, productData: any) {
    return fetchApi(`/api/produtos/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    })
  },

  // Excluir produto (admin)
  async deleteProduct(id: number) {
    return fetchApi(`/api/produtos/${id}`, {
      method: "DELETE",
    })
  },
}

// Serviço de agendamentos com personal trainer
export const appointmentService = {
  // Obter todos os agendamentos (admin)
  async getAllAppointments() {
    try {
      return await fetchApi("/api/agendamentos")
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error)
      return {
        "hydra:member": [],
        "hydra:totalItems": 0,
      }
    }
  },

  // Criar novo agendamento
  async createAppointment(appointmentData: any) {
    return fetchApi("/api/agendamentos", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    })
  },

// Obter agendamentos de um usuário específico (admin ou próprio usuário)
  async getUserAppointments(userId: number) {
    try {
      return await fetchApi(`/api/agendamentos/usuario/${userId}`)
    } catch (error) {
      console.error(`Erro ao buscar agendamentos do usuário ${userId}:`, error)
      return {
        "hydra:member": [],
        "hydra:totalItems": 0,
      }
    }
  },

  // Atualizar agendamento
  async updateAppointment(id: number, appointmentData: any) {
    return fetchApi(`/api/agendamentos/${id}`, {
      method: "PUT",
      body: JSON.stringify(appointmentData),
    })
  },

}

// Serviço de personal trainers
export const trainerService = {
  // Obter todos os personal trainers
  async getAllTrainers() {
    try {
      return await fetchApi("/api/trainers")
    } catch (error) {
      console.error("Erro ao buscar personal trainers:", error)
      return {
        "hydra:member": [],
        "hydra:totalItems": 0,
      }
    }
  },

  // Criar novo personal trainer (admin)
  async createTrainer(trainerData: any) {
    return fetchApi("/api/trainers", {
      method: "POST",
      body: JSON.stringify(trainerData),
    })
  },

  // Atualizar personal trainer (admin)
  async updateTrainer(id: number, trainerData: any) {
    return fetchApi(`/api/trainers/${id}`, {
      method: "PUT",
      body: JSON.stringify(trainerData),
    })
  },

  // Excluir personal trainer (admin)
  async deleteTrainer(id: number) {
    return fetchApi(`/api/trainers/${id}`, {
      method: "DELETE",
    })
  },
}

