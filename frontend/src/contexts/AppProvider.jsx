import { AuthProvider } from "./AuthContext";
import { BookmarkProvider} from "./BookmarkContext";
import { TagProvider } from "./TagContext";


export const AppProvider = ({ children }) => {
    return(
    <AuthProvider>
      <BookmarkProvider>
        <TagProvider>
          {children}
        </TagProvider>
      </BookmarkProvider>
    </AuthProvider>
    )
}

export default AppProvider