Namespace MicroStrategy
    Partial Class VisBuilder_Content_Core
         Inherits MSTRControls.MSTRUserControl

         Private Sub Page_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
            Dim ex As System.Exception

            Try

            Catch ex
                Me.setError(Me, ex)

            End Try
        End Sub
    End Class
End Namespace