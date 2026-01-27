from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped
from sqlalchemy import String, Boolean
from passlib.context import CryptContext

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    password: Mapped[str] = mapped_column(String)
    role: Mapped[str] = mapped_column(String, default="UTILISATEUR")
    active: Mapped[bool] = mapped_column(Boolean, default=True)

    @staticmethod
    def hash(p):
        return pwd.hash(p)

    def verify(self, p):
        return pwd.verify(p, self.password)