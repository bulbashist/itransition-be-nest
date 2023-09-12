import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/users/entities/user.entity';
import { AccessToken } from 'src/utility/types';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class Test implements CanActivate {
  constructor(
    @InjectRepository(Comment)
    private _repo: Repository<Comment>,
    private _jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToWs().getClient() as Socket;
    const cookie = req.handshake.headers.cookie;
    const { id } = context.switchToWs().getData();
    const { accessToken } = this.parseCookieHeader(cookie) as {
      accessToken: AccessToken;
    };
    const { id: userId, isAdmin } = accessToken;

    const comment = await this._repo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (isAdmin || comment.user.id === userId) {
      return true;
    }

    return false;
  }

  private parseCookieHeader(cookieHeader: string) {
    const cookies = {};
    if (cookieHeader) {
      const cookieList = cookieHeader.split(';');
      cookieList.forEach((cookie) => {
        const [name, value] = cookie.trim().split('=');
        cookies[name] = value;
      });
    }
    return cookies;
  }
}
