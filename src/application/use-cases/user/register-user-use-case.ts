import { User } from "@/domain/entities";
import { IUserRepository } from "@/domain/repositories";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

interface RegisterUserRequest {
  name: string;
  email: string;
  phone: string;
  document: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ name, email, phone, document, password }: RegisterUserRequest) {
    if (await this.userRepository.findByEmail(email)) {
      throw new Error("Utilizador já registado com este e-mail.");
    }

    if (await this.userRepository.findByPhone(phone)) {
      throw new Error("Utilizador já registado com este telemóvel.");
    }

    if (await this.userRepository.findByDocument(document)) {
      throw new Error("Utilizador já registado com este documento.");
    }
  
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ name, email, phone, document, passwordHash, emailConfirmed: false }, uuidv4());

    await this.userRepository.save(user);

    return { id: user.id, name: user.name, email: user.email, phone: user.phone, document: user.document };
  }
}
