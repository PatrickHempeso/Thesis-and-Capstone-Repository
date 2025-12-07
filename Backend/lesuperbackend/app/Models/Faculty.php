<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Faculty extends Authenticatable
{
    use HasApiTokens, Notifiable;
    
    protected $table = 'faculty'; // <-- add this line

    protected $primaryKey = 'FacultyID';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'FacultyID', 'FirstName', 'LastName', 'LoginDetails', 'Password', 'Role', 'AdminID'
    ];
}
