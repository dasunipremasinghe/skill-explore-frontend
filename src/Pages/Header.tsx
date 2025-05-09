

interface User {
  id: string | number;
  name?: string;
  avatar?: string;
}

interface HeaderProps {
  currentUser: User | null;
}

      </div>
    </header>
  );
};

export default Header;
